import { fromEvent, merge } from 'rxjs';
import { map, filter, tap } from 'rxjs/operators';
import { useRxFileToImage } from './useRxFileToImage';

export function fromDrop(el) {
  return merge(
    fromEvent(el, 'drop'),
    fromEvent(el, 'dragover').pipe(tap((event: any) => event.preventDefault()))
  ).pipe(
    filter(event => event.type === 'drop'),
    map(event => event as DragEvent),
    map<DragEvent, [DataTransferItemList | null, Event]>(dragEvent => [
      dragEvent.dataTransfer && dragEvent.dataTransfer.items,
      dragEvent,
    ])
  );
}

export function useRxDropImage<T>(): ReturnType<typeof useRxFileToImage> {
  return useRxFileToImage<T>(fromDrop);
}
