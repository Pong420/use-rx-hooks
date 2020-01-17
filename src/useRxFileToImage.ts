import { SyntheticEvent, useMemo } from 'react';
import { Observable, merge } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

export type RxFileToImageSource = [
  FileList | DataTransferItemList | null,
  Event | SyntheticEvent<Element | Window>
];

export interface RxFileToImageState {
  file: File;
  url: string;
}

function isFile(object: any): object is File {
  return object instanceof File;
}

export function fileToImage([items, event]: RxFileToImageSource) {
  const list: Observable<RxFileToImageState>[] = [];
  if (items && items.length) {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf('image') !== -1) {
        event.preventDefault();
        const file = isFile(item) ? item : item.getAsFile();
        if (file) {
          list.push(
            getBase64ImageURL(file).pipe(
              map<string, RxFileToImageState>(url => ({ url, file }))
            )
          );
        }
      }
    }
  }
  return list;
}

export function useRxFileToImage(
  source$: Observable<RxFileToImageSource> | Observable<RxFileToImageSource>[]
) {
  return useMemo<Observable<RxFileToImageState>>(
    () =>
      merge(...(Array.isArray(source$) ? source$ : [source$])).pipe(
        mergeMap(([items, event]) => {
          return merge(...fileToImage([items, event]));
        })
      ),
    [source$]
  );
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
