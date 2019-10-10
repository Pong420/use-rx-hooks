import { SyntheticEvent } from 'react';
import { Observable, empty, merge } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { useEffect, useState } from 'react';

interface GetBase64ImageParams {
  file: File | null;
  type: string;
}

export interface RxFileToImageState extends GetBase64ImageParams {
  url: string;
}

export function useRxFileToImage(
  ...source$: Array<
    Observable<
      [DataTransferItemList | null, Event | SyntheticEvent<Element | Window>]
    >
  >
) {
  const [state, setState] = useState<RxFileToImageState>();

  useEffect(() => {
    const subscription = merge(...source$)
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
                map<string, RxFileToImageState>(url => ({ url, ...state }))
              )
            : empty()
        )
      )
      .subscribe(setState);

    return () => subscription.unsubscribe();
  }, [source$]);

  return state;
}

const getBase64ImageURL = ({ file, type }: GetBase64ImageParams) => {
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
