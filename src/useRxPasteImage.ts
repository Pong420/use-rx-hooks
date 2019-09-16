import { fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';
import { useRxFileToImage } from './useRxFileToImage';

export function fromPaste(el) {
  return fromEvent(el, 'paste').pipe(
    map(event => event as ClipboardEvent),
    map<ClipboardEvent, [DataTransferItemList | null, Event]>(
      clipboardEvent => [
        clipboardEvent.clipboardData && clipboardEvent.clipboardData.items,
        clipboardEvent,
      ]
    )
  );
}

export function useRxPasteImage<T>(): ReturnType<typeof useRxFileToImage> {
  return useRxFileToImage<T>(fromPaste);
}
