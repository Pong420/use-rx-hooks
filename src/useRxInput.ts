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

export type RxInputPipe<O> = (ob: Observable<string>) => Observable<O>;

export interface RxInputOptions<O, T extends TargetEl = HTMLInputElement> {
  interceptors?: (el: T) => (ob: Observable<Event>) => Observable<Event>;
  defaultValue?: string;
  pipe?: RxInputPipe<O>;
}

export type RxInputState<O, T extends TargetEl = HTMLInputElement> = [
  O | undefined,
  InputProps<T>
];

export function useRxInput<O, T extends TargetEl = HTMLInputElement>(
  options?: RxInputOptions<O, T> & { pipe?: undefined }
): RxInputState<string, T>;

export function useRxInput<O, T extends TargetEl = HTMLInputElement>(
  options?: RxInputOptions<O, T> & { pipe: RxInputPipe<O> }
): RxInputState<O, T>;

export function useRxInput<O, T extends TargetEl = HTMLInputElement>({
  defaultValue = '',
  interceptors,
  pipe,
}: RxInputOptions<O, T> = {}): RxInputState<O, T> {
  const ref = useRef<T>(null);
  const [value, setValue] = useState<O>();

  useEffect(() => {
    const el = ref.current;
    if (el) {
      let source$: Observable<any> = fromEvent(el, 'input').pipe(
        interceptors ? interceptors(el) : map(evt => evt),
        map(evt => evt as ChangeEvent<T>),
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

  return [
    value,
    {
      ref,
      defaultValue,
    },
  ];
}
