import { useEffect, useReducer, useRef, useMemo, Reducer } from 'react';
import { defer as RxDefer, ObservableInput, Subject, of } from 'rxjs';
import {
  exhaustMap,
  switchMap,
  concatMap,
  mergeMap,
  flatMap,
  catchError,
  takeUntil,
  filter,
  tap,
  map
} from 'rxjs/operators';

interface State<I> {
  data?: I;
  error?: any;
  loading: boolean;
}

export type RxAsyncInit<P> = { type: 'FETCH_INIT'; payload?: P };
export type RxAsyncSuccess<I> = { type: 'FETCH_SUCCESS'; payload: I };
export type RxAsyncFailure = { type: 'FETCH_FAILURE'; payload?: any };
export type RxAsyncCancel = { type: 'CANCEL' };
export type RxAsyncReset = { type: 'RESET' };

type Actions<I, P> =
  | RxAsyncInit<P>
  | RxAsyncSuccess<I>
  | RxAsyncFailure
  | RxAsyncCancel
  | RxAsyncReset;

function initializerArg<I>(data?: I): State<I> {
  return {
    loading: false,
    data
  };
}

function reducer<I, P>(state: State<I>, action: Actions<I, P>): State<I> {
  switch (action.type) {
    case 'FETCH_INIT':
      return {
        ...initializerArg(state.data),
        loading: true
      };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, data: action.payload };
    case 'FETCH_FAILURE':
      return { ...state, loading: false, error: action.payload };
    case 'CANCEL':
      return { ...state, loading: false };
    case 'RESET':
      return { ...initializerArg() };
    default:
      throw new Error();
  }
}

const defaultFn = () => {};

type F1<P, O> = (params: P) => O;
type F2<P, O> = (() => O) | ((params?: P) => O);
type RxF1<I, P> = F1<P, ObservableInput<I>>;
type RxF2<I, P> = F2<P, ObservableInput<I>>;

export type RxAsyncFn<I, P> = RxF1<I, P> | RxF2<I, P>;

export type RxAsyncOptions<I> = {
  defer?: boolean;
  onStart?(): void;
  onSuccess?(value: I): void;
  onFailure?(error: any): void;
  mapOperator?:
    | typeof switchMap
    | typeof concatMap
    | typeof exhaustMap
    | typeof mergeMap
    | typeof flatMap;
};

export type RxAsyncActionsBase<I, P> = {
  subject: Subject<Actions<I, P>>;
  cancel: () => void;
  reset: () => void;
};

export interface RxAsyncActionsWithParam<I, P>
  extends RxAsyncActionsBase<I, P> {
  fetch: F1<P, void>;
}

export interface RxAsyncActionsOptionalParam<I, P>
  extends RxAsyncActionsBase<I, P> {
  fetch: F2<P, void>;
}

export type RxAsyncState<I> = State<I>;

export type RxAsyncActions<I, P> =
  | RxAsyncActionsWithParam<I, P>
  | RxAsyncActionsOptionalParam<I, P>;

export function useRxAsync<I, P>(
  request: RxF2<I, P>,
  options?: RxAsyncOptions<I> & { defer?: boolean }
): [RxAsyncState<I>, RxAsyncActionsOptionalParam<I, P>];

export function useRxAsync<I, P>(
  request: RxF1<I, P>,
  options: RxAsyncOptions<I> & { defer: true }
): [RxAsyncState<I>, RxAsyncActionsWithParam<I, P>];

export function useRxAsync<I, P>(
  request: RxAsyncFn<I, P>,
  options?: RxAsyncOptions<I>
): [RxAsyncState<I>, RxAsyncActions<I, P>] {
  const {
    defer,
    onStart = defaultFn,
    onSuccess = defaultFn,
    onFailure = defaultFn,
    mapOperator = switchMap
  } = options || {};

  const [
    //
    state,
    dispatch
  ] = useReducer<Reducer<State<I>, Actions<I, P>>, I | undefined>(
    reducer,
    undefined,
    initializerArg
  );

  const actionRef = useRef(new Subject<Actions<I, P>>());

  const actions = useMemo<RxAsyncActions<I, P>>(() => {
    return {
      fetch: (payload?: P) =>
        actionRef.current.next({ type: 'FETCH_INIT', payload }),
      reset: () => actionRef.current.next({ type: 'RESET' }),
      cancel: () => actionRef.current.next({ type: 'CANCEL' }),
      subject: actionRef.current
    };
  }, []);

  useEffect(() => {
    const action$ = <A extends Actions<I, P>>(...types: A['type'][]) =>
      actionRef.current.pipe(
        filter((action): action is A => types.includes(action.type))
      );

    const subscription = action$<RxAsyncInit<P>>('FETCH_INIT')
      .pipe(
        mapOperator(action =>
          RxDefer(() => request(action.payload!)).pipe(
            map<I, RxAsyncSuccess<I>>(payload => ({
              type: 'FETCH_SUCCESS',
              payload
            })),
            catchError(payload =>
              of<RxAsyncFailure>({ type: 'FETCH_FAILURE', payload })
            ),
            takeUntil(action$<RxAsyncCancel | RxAsyncReset>('CANCEL', 'RESET'))
          )
        )
      )
      .subscribe(action => {
        actionRef.current.next(action);
      });

    const actionSubscription = actionRef.current
      .pipe(
        tap(action => {
          switch (action.type) {
            case 'FETCH_INIT':
              return onStart();
            case 'FETCH_SUCCESS':
              return onSuccess(action.payload);
            case 'FETCH_FAILURE':
              return onFailure(action.payload);
          }
        })
      )
      .subscribe(dispatch);

    actionRef.current.next({ type: 'RESET' });

    if (!defer) {
      actionRef.current.next({ type: 'FETCH_INIT' });
    }

    return () => {
      subscription.unsubscribe();
      actionSubscription.unsubscribe();
    };
  }, [defer, request, actions, mapOperator, onStart, onSuccess, onFailure]);

  return [state, actions];
}
