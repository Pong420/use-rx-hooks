import { ClipboardEvent, useMemo } from 'react';
import { Subject } from 'rxjs';
import { map, switchMap, mergeAll } from 'rxjs/operators';
import { fileToImage } from './useRxFileToImage';

export function fromPasteImageEvent<T extends Window | Element>(
  clipboardEvent: ClipboardEvent<T>
) {
  return [
    clipboardEvent.clipboardData && clipboardEvent.clipboardData.items,
    clipboardEvent,
  ] as [DataTransferItemList | null, ClipboardEvent<T>];
}

export function useRxPasteImage<T extends Window | Element>() {
  const [source$, props] = useMemo(() => {
    const subject = new Subject<ClipboardEvent<T>>();
    return [
      subject.pipe(
        map(fromPasteImageEvent),
        switchMap(fileToImage),
        mergeAll()
      ),
      {
        onPaste: (event: ClipboardEvent<T>) => subject.next(event),
      },
    ];
  }, []);

  return [source$, props] as const;
}
