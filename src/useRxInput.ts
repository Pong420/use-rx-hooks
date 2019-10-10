import {
  useRef,
  useEffect,
  useState,
  ChangeEvent,
  useCallback,
  InputHTMLAttributes,
} from 'react';
import { Observable, Subject, pipe as rxPipe } from 'rxjs';
import { map, startWith, tap } from 'rxjs/operators';

export type RxInputEl = HTMLInputElement | HTMLTextAreaElement;

export type RxInputPipe<O> = (ob: Observable<string>) => Observable<string | O>;

export interface RxInputOptions<O> {
  test?: any;
  defaultValue?: string;
  pipe?: RxInputPipe<O>;
}

type State<O, T extends RxInputEl = HTMLInputElement> = [
  O,
  Required<Pick<InputHTMLAttributes<T>, 'value' | 'onChange'>>
];

export function useRxInput<O, T extends RxInputEl = HTMLInputElement>(
  options?: RxInputOptions<O> & { pipe?: undefined }
): State<string, T>;

export function useRxInput<O, T extends RxInputEl = HTMLInputElement>(
  options?: RxInputOptions<O> & { pipe: RxInputPipe<O> }
): State<undefined | O, T>;

export function useRxInput<O, T extends RxInputEl = HTMLInputElement>({
  defaultValue = '',
  pipe,
}: RxInputOptions<O> = {}): State<O | string | undefined, T> {
  const subject = useRef(new Subject<ChangeEvent<T>>());
  const [value, setValue] = useState<string>(defaultValue);
  const [output, setOutput] = useState<O | string | undefined>(
    typeof pipe === 'undefined' ? defaultValue : undefined
  );

  const handleChange = useCallback(
    (event: ChangeEvent<T>) => subject.current.next(event),
    []
  );

  useEffect(() => {
    const subsciprtion = subject.current
      .pipe(
        map(evt => evt.target.value),
        tap(next => setValue(next)),
        startWith(defaultValue),
        pipe || rxPipe()
      )
      .subscribe(setOutput);

    return () => subsciprtion.unsubscribe();
  }, [defaultValue, pipe]);

  return [output, { value, onChange: handleChange }];
}
