import { ClipboardEvent, useMemo } from 'react';
import { Subject, zip } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { fileToImage } from './useRxFileToImage';

export function fromPasteImageEvent<T extends Window | Element>(
  clipboardEvent: ClipboardEvent<T>
) {
  return [
    clipboardEvent.clipboardData && clipboardEvent.clipboardData.items,
    clipboardEvent
  ] as [DataTransferItemList | null, ClipboardEvent<T>];
}

export function useRxPasteImage<T extends Window | Element>() {
  const [source$, props] = useMemo(() => {
    const subject = new Subject<ClipboardEvent<T>>();
    return [
      subject.pipe(
        map(fromPasteImageEvent),
        mergeMap(payload => zip(...fileToImage(payload)))
      ),
      {
        onPaste: (event: ClipboardEvent<T>) => subject.next(event)
      }
    ];
  }, []);

  return [source$, props] as const;
}
