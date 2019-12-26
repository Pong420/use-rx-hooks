import { useEffect, useReducer, useRef, useMemo, Reducer } from 'react';
import { from, ObservableInput, Subject, empty } from 'rxjs';
import {
  exhaustMap,
  switchMap,
  concatMap,
  mergeMap,
  flatMap,
  catchError,
  takeUntil,
} from 'rxjs/operators';

type RxAsyncFnWithParam<I, P> = (params: P) => ObservableInput<I>;

type RxAsyncFnOptionalParam<I, P> =
  | (() => ObservableInput<I>)
  | ((params?: P) => ObservableInput<I>);

export type RxAsyncFn<I, P> =
  | RxAsyncFnOptionalParam<I, P>
  | RxAsyncFnWithParam<I, P>;

export interface RxAsyncOptions<I> {
  initialValue?: I;
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
}

interface RxAsyncStateCommon<I> extends State<I> {
  cancel: () => void;
  reset: () => void;
}

type RxAsyncStateWithParam<I, P> = RxAsyncStateCommon<I> & {
  run: (params: P) => void;
};

type RxAsyncStateOptionalParam<I, P> = RxAsyncStateCommon<I> & {
  run: (() => void) | ((params?: P) => void);
};

export type RxAsyncState<I, P> =
  | RxAsyncStateOptionalParam<I, P>
  | RxAsyncStateWithParam<I, P>;

interface State<I> {
  loading: boolean;
  error?: any;
  data?: I;
  initialValue?: I;
}

type Actions<I> =
  | { type: 'FETCH_INIT' }
  | { type: 'FETCH_SUCCESS'; payload: I }
  | { type: 'FETCH_FAILURE'; payload?: any }
  | { type: 'CANCEL' }
  | { type: 'RESET' };

function initializerArg<I>(data?: I): State<I> {
  return {
    loading: false,
    data,
    initialValue: data,
  };
}

function reducer<I>(state: State<I>, action: Actions<I>): State<I> {
  switch (action.type) {
    case 'FETCH_INIT':
      return {
        ...initializerArg(state.data),
        initialValue: state.initialValue,
        loading: true,
      };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, data: action.payload };
    case 'FETCH_FAILURE':
      return { ...state, loading: false, error: action.payload };
    case 'CANCEL':
      return { ...state, loading: false };
    case 'RESET':
      return { ...initializerArg(state.initialValue) };
    default:
      throw new Error();
  }
}

const defaultFn = () => {};

export function useRxAsync<I, P>(
  fn: RxAsyncFnOptionalParam<I, P>,
  options: RxAsyncOptions<I> & {
    initialValue: I;
  }
): RxAsyncStateOptionalParam<I, P> & { data: I };

export function useRxAsync<I, P>(
  fn: RxAsyncFnWithParam<I, P>,
  options: RxAsyncOptions<I> & {
    initialValue: I;
    defer: true;
  }
): RxAsyncStateWithParam<I, P> & { data: I };

export function useRxAsync<I, P>(
  fn: RxAsyncFnOptionalParam<I, P>,
  options?: RxAsyncOptions<I>
): RxAsyncStateOptionalParam<I, P>;

export function useRxAsync<I, P>(
  fn: RxAsyncFnWithParam<I, P>,
  options: RxAsyncOptions<I> & {
    defer: true;
  }
): RxAsyncStateWithParam<I, P>;

export function useRxAsync<I, P>(
  fn: RxAsyncFn<I, P>,
  options: RxAsyncOptions<I> = {}
): RxAsyncState<I, P> {
  const {
    defer,
    initialValue,
    onStart = defaultFn,
    onSuccess = defaultFn,
    onFailure = defaultFn,
    mapOperator = switchMap,
  } = options;

  const [state, dispatch] = useReducer<
    Reducer<State<I>, Actions<I>>,
    I | undefined
  >(reducer, initialValue, initializerArg);

  const subject = useRef(new Subject<P>());
  const cancelSubject = useRef(new Subject());

  const { run, cancel, reset } = useMemo(() => {
    const run = (params?: P) => subject.current.next(params as P);

    const cancel = () => {
      cancelSubject.current.next();
      dispatch({ type: 'CANCEL' });
    };

    const reset = () => {
      cancelSubject.current.next();
      dispatch({ type: 'RESET' });
    };

    return { run, cancel, reset };
  }, []);

  useEffect(() => {
    reset();

    const subscription = subject.current
      .pipe(
        mapOperator(params => {
          onStart();
          dispatch({ type: 'FETCH_INIT' });
          return from<ObservableInput<I>>(fn(params)).pipe(
            catchError(payload => {
              onFailure(payload);
              dispatch({ type: 'FETCH_FAILURE', payload });
              return empty();
            }),
            takeUntil(cancelSubject.current)
          );
        })
      )
      .subscribe(payload => {
        dispatch({ type: 'FETCH_SUCCESS', payload });
        onSuccess(payload);
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [fn, run, defer, reset, mapOperator, onStart, onSuccess, onFailure]);

  useEffect(() => {
    !defer && run();
  }, [run, defer, fn]);

  return { ...state, run, cancel, reset };
}
