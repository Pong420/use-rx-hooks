import { useRef, useEffect, useState, RefObject } from 'react';
import { Observable, fromEvent } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

type TargetEl = HTMLInputElement | HTMLTextAreaElement;

interface ChangeEvent<T = Element> extends Event {
  target: EventTarget & T & { value: string };
}

interface InputProps<T extends TargetEl = HTMLInputElement> {
  ref: RefObject<T>;
  defaultValue?: string;
}

export type RxInputPipe<O> = (
  ob: Observable<string | undefined>
) => Observable<O>;

export interface UseRxInputOptions<O, T extends TargetEl = HTMLInputElement> {
  interceptors?: (el: T) => (ob: Observable<Event>) => Observable<Event>;
  defaultValue?: string;
  pipe?: RxInputPipe<O>;
}

export function useRxInput<O, T extends TargetEl = HTMLInputElement>({
  defaultValue,
  interceptors,
  pipe,
}: UseRxInputOptions<O, T> = {}) {
  const ref = useRef<T>(null);
  const [value, setValue] = useState<O | undefined>();

  useEffect(() => {
    const el = ref.current;
    if (el) {
      let source$: Observable<any> = fromEvent(el, 'input').pipe(
        interceptors ? interceptors(el) : map(evt => evt),
        map(evt => evt as ChangeEvent),
        map(evt => evt.target.value),
        startWith(defaultValue)
      );

      if (pipe) {
        source$ = source$.pipe(pipe);
      }

      const subscription = source$.subscribe(setValue);
      return () => subscription.unsubscribe();
    }
  }, [pipe, defaultValue, interceptors]);

  const inputProps: InputProps<T> = {
    ref,
    defaultValue,
  };

  const result: [typeof value, typeof inputProps] = [
    value,
    {
      ref,
      defaultValue,
    },
  ];

  return result;
}