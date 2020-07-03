import { DragEvent, useMemo } from 'react';
import { Subject, zip } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { fileToImage } from './useRxFileToImage';

export function fromDropImageEvent<T extends Element | Window>(
  dragEvent: DragEvent<T>
) {
  return [
    dragEvent.dataTransfer && dragEvent.dataTransfer.items,
    dragEvent,
  ] as [DataTransferItemList | null, DragEvent<T>];
}

export const preventDragOver = <T extends Window | Element>(
  event: DragEvent<T>
) => event.preventDefault();

export function useRxDropImage<T extends Window | Element>() {
  const [source$, props] = useMemo(() => {
    const subject = new Subject<DragEvent<T>>();
    return [
      // prettier-ignore
      subject.pipe(
        map(fromDropImageEvent),
        mergeMap(payload => zip(...fileToImage(payload)))
      ),
      {
        onDragOver: preventDragOver,
        onDrop: (event: DragEvent<T>) => {
          subject.next(event);
        },
      },
    ];
  }, []);

  return [source$, props] as const;
}
