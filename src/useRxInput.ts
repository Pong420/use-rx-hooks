import { useRef, useEffect, useState, RefObject } from 'react';
import { fromEvent } from 'rxjs/_esm5/internal/observable/fromEvent';
import { Observable } from 'rxjs/_esm5/internal/Observable';
import { map, startWith } from 'rxjs/_esm5/internal/operators';

type TargetEl = HTMLInputElement | HTMLTextAreaElement;

interface ChangeEvent<T = Element> extends Event {
  target: EventTarget & T & { value: string };
  isComposing: boolean;
}

interface InputProps<T extends TargetEl = HTMLInputElement> {
  ref: RefObject<T>;
  defaultValue?: string;
}

export type RxInputPipe<O> = (ob: Observable<string | undefined>) => Observable<O>;

export interface UseRxInputOptions<O> {
  defaultValue?: string;
  pipe?: RxInputPipe<O>;
}

export function useRxInput<O, T extends TargetEl = HTMLInputElement>({
  defaultValue,
  pipe,
}: UseRxInputOptions<O> = {}) {
  const ref = useRef<T>(null);
  const [value, setValue] = useState<O | undefined>();

  useEffect(() => {
    const el = ref.current;
    if (el) {
      let source$: Observable<any> = fromEvent(el, 'input').pipe(
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
  }, [pipe]);

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
