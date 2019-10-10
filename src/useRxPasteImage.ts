import { ClipboardEvent, useRef } from 'react';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { useRxFileToImage } from './useRxFileToImage';

export function fromPasteImageEvent<T extends Window | Element>(
  clipboardEvent: ClipboardEvent<T>
) {
  return [
    clipboardEvent.clipboardData && clipboardEvent.clipboardData.items,
    clipboardEvent,
  ] as [DataTransferItemList | null, ClipboardEvent<T>];
}

export function useRxPasteImage<T extends Window | Element>() {
  const subject = useRef(new Subject<ClipboardEvent<T>>());
  const onPaste = (event: ClipboardEvent<T>) => subject.current.next(event);

  const props = { onPaste };
  const state = useRxFileToImage(
    subject.current.asObservable().pipe(map(fromPasteImageEvent))
  );
  return [state, props];
}
