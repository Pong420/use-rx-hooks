import { useEffect, useCallback, useReducer, useRef, Reducer } from 'react';
import { Subscription } from 'rxjs/_esm5/internal/Subscription';
import { Observable, ObservableInput } from 'rxjs/_esm5/internal/Observable';
import { from } from 'rxjs/_esm5/internal/observable/from';

type AsyncFn<T> = () => ObservableInput<T>;

export interface UseRxAsyncOptions<I, O = I> {
  initialValue?: O;
  defer?: boolean;
  pipe?: (ob: Observable<I>) => Observable<O>;
  onSuccess?(value: O): void;
  onFailure?(error: any): void;
}

interface State<T> {
  loading: boolean;
  error?: any;
  data?: T;
}

type Actions<T> =
  | { type: 'FETCH_INIT' }
  | { type: 'FETCH_SUCCESS'; payload: T }
  | { type: 'FETCH_FAILURE'; payload?: any }
  | { type: 'CANCEL' };

const initialArg: State<any> = { loading: false };

function reducer<T>(state: State<T>, action: Actions<T>): State<T> {
  switch (action.type) {
    case 'FETCH_INIT':
      return { ...initialArg, loading: true, data: state.data };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, data: action.payload };
    case 'FETCH_FAILURE':
      return { ...state, loading: false, error: action.payload };
    case 'CANCEL':
      return { ...state, loading: false };
    default:
      throw new Error();
  }
}

export function useRxAsync<T, O = T>(fn: AsyncFn<T>, options: UseRxAsyncOptions<T, O> = {}) {
  const { defer, pipe, initialValue, onSuccess, onFailure } = options;
  const [state, dispatch] = useReducer<Reducer<State<O>, Actions<O>>>(reducer, {
    ...initialArg,
    data: initialValue,
  });
  const deferRef = useRef(!!defer);
  const subscription = useRef(new Subscription());

  const run = useCallback(() => {
    dispatch({ type: 'FETCH_INIT' });

    let source$: Observable<any> = from(fn());

    if (pipe) {
      source$ = source$.pipe(pipe);
    }

    const newSubscription = source$.subscribe(
      payload => {
        dispatch({ type: 'FETCH_SUCCESS', payload });
        onSuccess && onSuccess(payload);
      },
      payload => {
        dispatch({ type: 'FETCH_FAILURE', payload });
        onFailure && onFailure(payload);
      }
    );

    subscription.current.unsubscribe();
    subscription.current = newSubscription;
  }, [fn, pipe, onSuccess, onFailure]);

  const cancel = useCallback(() => {
    subscription.current.unsubscribe();
    dispatch({ type: 'CANCEL' });
  }, [dispatch, subscription]);

  useEffect(() => {
    if (deferRef.current === false) {
      run();
    }
    deferRef.current = false;
  }, [dispatch, run]);

  return { ...state, run, cancel };
}
