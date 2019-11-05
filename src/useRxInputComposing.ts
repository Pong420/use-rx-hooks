import { useMemo, useRef, CompositionEvent, InputHTMLAttributes } from 'react';
import { Subject, Observable, merge, pipe as rxPipe } from 'rxjs';
import { startWith, filter, combineLatest, map } from 'rxjs/operators';
import {
  useRxInput,
  RxInputOptions,
  RxInputPipe,
  RxInputEl,
} from './useRxInput';

interface InputProps<T>
  extends Required<
    Pick<
      InputHTMLAttributes<T>,
      'onChange' | 'onCompositionStart' | 'onCompositionEnd'
    >
  > {
  value: string;
}

type State<O, T extends RxInputEl = HTMLInputElement> = [O, InputProps<T>];

export function useRxInputComposing<O, T extends RxInputEl = HTMLInputElement>(
  options?: RxInputOptions<O> & { pipe?: undefined }
): State<string, T>;

export function useRxInputComposing<O, T extends RxInputEl = HTMLInputElement>(
  options?: RxInputOptions<O> & { pipe: RxInputPipe<O> }
): State<undefined | O, T>;

export function useRxInputComposing<O, T extends RxInputEl = HTMLInputElement>({
  pipe,
  ...options
}: RxInputOptions<O> = {}): State<string | O | undefined, T> {
  const compositionStart$ = useRef(new Subject<CompositionEvent<T>>());
  const compositionEnd$ = useRef(new Subject<CompositionEvent<T>>());

  const isComposing = useMemo(
    () => (source$: Observable<string>) => {
      const isComposing$ = merge(
        compositionStart$.current.pipe(map(() => true)),
        compositionEnd$.current.pipe(map(() => false))
      ).pipe(startWith(false));

      return source$.pipe(
        combineLatest(isComposing$),
        filter(([, isComposing]) => !isComposing),
        map(([value]) => value),
        pipe || rxPipe()
      );
    },
    [pipe]
  );

  const [value, inputProps] = useRxInput<O | string | undefined, T>({
    pipe: isComposing,
    ...options,
  });

  const newProps = useMemo(() => {
    const handler = (subject: Subject<CompositionEvent<T>>) => (
      event: CompositionEvent<T>
    ) => subject.next(event);

    return {
      ...inputProps,
      onCompositionStart: handler(compositionStart$.current),
      onCompositionEnd: handler(compositionEnd$.current),
    };
  }, [inputProps]);

  return [value, newProps];
}
