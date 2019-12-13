import { DragEvent, useRef, useMemo } from 'react';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { useRxFileToImage } from './useRxFileToImage';

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
  const subject = useRef(new Subject<DragEvent<T>>());

  const [source$, props] = useMemo(
    () => [
      subject.current.pipe(map(fromDropImageEvent)),
      {
        onDragOver: preventDragOver,
        onDrop: (event: DragEvent<T>) => {
          subject.current.next(event);
        },
      },
    ],
    []
  );

  const state = useRxFileToImage(source$);

  return [state, props] as const;
}
