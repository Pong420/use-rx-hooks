import { useRef, useCallback, useState, useEffect, UIEvent } from 'react';
import { Observable, Subject } from 'rxjs';
import { map, tap, debounceTime } from 'rxjs/operators';

export interface RxScrollState {
  x: number;
  y: number;
  scrolling: boolean;
}

function getPos(el: Window | Element): Pick<RxScrollState, 'x' | 'y'> {
  return el instanceof Window
    ? { x: el.scrollX, y: el.scrollY }
    : { x: el.scrollTop, y: el.scrollLeft };
}

const initialState: RxScrollState = {
  x: 0,
  y: 0,
  scrolling: false
};

export function useRxScroll<T extends Window | Element>(
  ob?: Observable<UIEvent<T>>
) {
  const subject = useRef(new Subject<UIEvent<T>>());
  const onScroll = useCallback(
    (event: UIEvent<T>) => subject.current.next(event),
    []
  );
  const [state, setState] = useState(initialState);

  useEffect(() => {
    const subscription = (ob || subject.current)
      .pipe(
        map(event => ({
          ...getPos(event.currentTarget),
          scrolling: true
        })),
        tap(state => setState(state)),
        debounceTime(150),
        tap(state => setState({ ...state, scrolling: false }))
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
      setState(initialState);
    };
  }, [ob]);

  const props = { onScroll };

  return [state, props] as const;
}
