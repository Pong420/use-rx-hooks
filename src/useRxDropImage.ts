import { DragEvent, useRef, useCallback } from 'react';
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
  const onDrop = useCallback((event: DragEvent<T>) => {
    subject.current.next(event);
  }, []);

  const state = useRxFileToImage(subject.current.pipe(map(fromDropImageEvent)));

  return [state, { onDrop, onDragOver: preventDragOver }] as const;
}
