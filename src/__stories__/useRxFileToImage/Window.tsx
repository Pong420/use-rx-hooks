import React, { ClipboardEvent, DragEvent } from 'react';
import { merge, fromEvent } from 'rxjs';
import { map, tap, filter } from 'rxjs/operators';
import { fromDropImageEvent } from '../../useRxDropImage';
import { fromPasteImageEvent } from '../../useRxPasteImage';
import { useRxFileToImage } from '../../useRxFileToImage';
import { Display } from './Display';

const paste$ = fromEvent<ClipboardEvent<Window>>(window, 'paste').pipe(
  map(fromPasteImageEvent)
);

const drop$ = merge(
  fromEvent<DragEvent<Window>>(window, 'drop'),
  fromEvent<DragEvent<Window>>(window, 'dragover').pipe(
    tap(event => event.preventDefault())
  )
).pipe(
  filter(event => event.type === 'drop'),
  map(fromDropImageEvent)
);

const source$ = [paste$, drop$];

export const Window = () => {
  const image = useRxFileToImage(source$);
  return <Display payload={image} />;
};
