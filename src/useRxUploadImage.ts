import { ChangeEvent, useMemo } from 'react';
import { Subject } from 'rxjs';
import { map, switchMap, mergeAll } from 'rxjs/operators';
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
      // prettier-ignore
      subject.pipe(
        map(fromChangeEvent),
        switchMap(fileToImage),
        mergeAll()
      ),
      {
        onChange: (event: ChangeEvent<HTMLInputElement>) => subject.next(event),
      },
    ];
  }, []);

  return [source$, props] as const;
}
