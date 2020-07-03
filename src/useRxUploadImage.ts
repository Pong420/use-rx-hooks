import { ChangeEvent, useMemo } from 'react';
import { Subject, zip } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { fileToImage } from './useRxFileToImage';

export function fromChangeEvent(event: ChangeEvent<HTMLInputElement>) {
  return [event.target.files && event.target.files, event] as [
    FileList | null,
    ChangeEvent<HTMLInputElement>
  ];
}

export function useRxUploadImage() {
  const [source$, props] = useMemo(() => {
    const subject = new Subject<ChangeEvent<HTMLInputElement>>();

    return [
      subject.pipe(
        map(fromChangeEvent),
        mergeMap(payload => zip(...fileToImage(payload)))
      ),
      {
        onChange: (event: ChangeEvent<HTMLInputElement>) => subject.next(event),
      },
    ];
  }, []);

  return [source$, props] as const;
}
