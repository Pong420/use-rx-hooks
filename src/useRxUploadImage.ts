import { ChangeEvent, useRef, useMemo } from 'react';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { useRxFileToImage } from './useRxFileToImage';

export function fromChangeEvent(event: ChangeEvent<HTMLInputElement>) {
  return [event.target.files && event.target.files, event] as [
    FileList | null,
    ChangeEvent<HTMLInputElement>
  ];
}

export function useRxUploadImage() {
  const subject = useRef(new Subject<ChangeEvent<HTMLInputElement>>());
  const [source$, props] = useMemo(
    () => [
      subject.current.pipe(map(fromChangeEvent)),
      {
        onChange: (event: ChangeEvent<HTMLInputElement>) =>
          subject.current.next(event),
      },
    ],
    []
  );

  const state = useRxFileToImage(source$);

  return [state, props] as const;
}
