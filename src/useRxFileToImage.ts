import { Observable, empty } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { useEffect, useState, useRef, RefObject } from 'react';
import { FromEventTarget } from 'rxjs/internal/observable/fromEvent';

interface GetBase64ImageArgs {
  file: File | null;
  type: string;
}

interface State extends GetBase64ImageArgs {
  url: string;
}

export type Return$UseRxFileToImage<T> = [
  State | undefined,
  {
    ref: RefObject<T>;
  }
];

export type UseRxFileToImageInput<E> = (
  target: FromEventTarget<E>
) => Observable<[DataTransferItemList | null, Event]>;

export function useRxFileToImage<T extends HTMLElement, E extends Event>(
  fn: UseRxFileToImageInput<E>
): Return$UseRxFileToImage<T> {
  const [state, setState] = useState<State>();
  const ref = useRef<T>(null);

  useEffect(() => {
    const target = ref.current;
    if (target) {
      const subscription = fn(target)
        .pipe(
          map(([items, event]) => {
            if (items && items.length) {
              for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf('image') !== -1) {
                  event.preventDefault();
                  return {
                    file: items[i].getAsFile(),
                    type: items[i].type,
                  };
                }
              }
            }
            return null;
          }),
          switchMap(state =>
            state
              ? getBase64ImageURL(state).pipe(
                  map<string, State>(url => ({ url, ...state }))
                )
              : empty()
          )
        )
        .subscribe(setState);

      return () => subscription.unsubscribe();
    }
  }, [fn]);

  return [state, { ref }];
}

const getBase64ImageURL = ({ file, type }: GetBase64ImageArgs) => {
  return new Observable<string>(observer => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx!.drawImage(img, 0, 0);
      observer.next(canvas.toDataURL(type));
    };

    img.src = URL.createObjectURL(file);
    img.onerror = observer.error;
  });
};
