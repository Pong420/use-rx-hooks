import { SyntheticEvent } from 'react';
import { Observable, empty, merge } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { useEffect, useState } from 'react';

type Source = [
  FileList | DataTransferItemList | null,
  Event | SyntheticEvent<Element | Window>
];

export interface RxFileToImageState {
  file: File;
  url: string;
}

export function useRxFileToImage(...source$: Array<Observable<Source>>) {
  const [state, setState] = useState<RxFileToImageState>();

  useEffect(() => {
    const subscription = merge(...source$)
      .pipe(
        map(([items, event]) => {
          if (items && items.length) {
            for (let i = 0; i < items.length; i++) {
              const item = items[i];
              if (item.type.indexOf('image') !== -1) {
                event.preventDefault();
                return item instanceof File ? item : item.getAsFile();
              }
            }
          }
          return null;
        }),
        switchMap(file =>
          file
            ? getBase64ImageURL(file).pipe(
                map<string, RxFileToImageState>(url => ({ url, file }))
              )
            : empty()
        )
      )
      .subscribe(setState);

    return () => subscription.unsubscribe();
  }, [source$]);

  return state;
}

const getBase64ImageURL = (file: File) => {
  return new Observable<string>(observer => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx!.drawImage(img, 0, 0);
      observer.next(canvas.toDataURL(file.type));
    };

    img.src = URL.createObjectURL(file);
    img.onerror = observer.error;
  });
};
