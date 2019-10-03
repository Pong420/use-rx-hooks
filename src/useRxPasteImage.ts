import { fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';
import { useRxFileToImage, RxFileToImageState } from './useRxFileToImage';
import { FromEventTarget } from 'rxjs/internal/observable/fromEvent';

export function fromPasteEvent<E>(el: FromEventTarget<E>) {
  return fromEvent(el, 'paste').pipe(
    map((event: any) => event as ClipboardEvent),
    map<ClipboardEvent, [DataTransferItemList | null, Event]>(
      clipboardEvent => [
        clipboardEvent.clipboardData && clipboardEvent.clipboardData.items,
        clipboardEvent,
      ]
    )
  );
}

export function useRxPasteImage<
  T extends HTMLElement,
  E extends Event = Event
>(): RxFileToImageState<T> {
  return useRxFileToImage<T, E>(fromPasteEvent);
}
