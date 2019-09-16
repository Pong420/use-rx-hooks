import { fromEvent, merge } from 'rxjs';
import { map, filter, tap } from 'rxjs/operators';
import {
  useRxFileToImage,
  ReturnType$UseRxFileToImage,
} from './useRxFileToImage';
import { FromEventTarget } from 'rxjs/internal/observable/fromEvent';

export function fromDrop<T extends Event>(el: FromEventTarget<T>) {
  return merge(
    fromEvent<T>(el, 'drop'),
    fromEvent<T>(el, 'dragover').pipe(tap(event => event.preventDefault()))
  ).pipe(
    filter(event => event.type === 'drop'),
    map((event: any) => event as DragEvent),
    map<DragEvent, [DataTransferItemList | null, Event]>(dragEvent => [
      dragEvent.dataTransfer && dragEvent.dataTransfer.items,
      dragEvent,
    ])
  );
}

export function useRxDropImage<
  T extends HTMLElement,
  E extends Event = Event
>(): ReturnType$UseRxFileToImage<T> {
  return useRxFileToImage<T, E>(fromDrop);
}
