import React, { ClipboardEvent, DragEvent, useEffect } from 'react';
import { fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';
import { fromDropImageEvent } from '../../useRxDropImage';
import { fromPasteImageEvent } from '../../useRxPasteImage';
import { useRxFileToImage } from '../../useRxFileToImage';
import { Display } from './Display';

const paste$ = fromEvent<ClipboardEvent<Window>>(window, 'paste').pipe(
  map(fromPasteImageEvent)
);

const drop$ = fromEvent<DragEvent<Window>>(window, 'drop').pipe(
  map(fromDropImageEvent)
);

const preventDefault = (evt: Event) => evt.preventDefault();

export const Window = () => {
  const image = useRxFileToImage(paste$, drop$);

  useEffect(() => {
    window.addEventListener('dragover', preventDefault);
    return () => window.removeEventListener('dragover', preventDefault);
  }, []);

  return <Display image={image} />;
};
