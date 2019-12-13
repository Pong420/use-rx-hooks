import { ClipboardEvent, useRef, useMemo } from 'react';
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

  const [source$, props] = useMemo(() => {
    return [
      subject.current.pipe(map(fromPasteImageEvent)),
      {
        onPaste: (event: ClipboardEvent<T>) => subject.current.next(event),
      },
    ];
  }, []);

  const state = useRxFileToImage(source$);

  return [state, props] as const;
}
