import React, {
  useRef,
  ChangeEvent,
  ClipboardEvent,
  DragEvent,
  useMemo,
} from 'react';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { useRxFileToImage } from '../../useRxFileToImage';
import { fromChangeEvent } from '../../useRxUploadImage';
import { fromDropImageEvent } from '../../useRxDropImage';
import { fromPasteImageEvent } from '../../useRxPasteImage';
import { Display } from './Display';

type UploadEvent = ChangeEvent | ClipboardEvent | DragEvent;

function mapEvent(event: UploadEvent) {
  if (event.type === 'paste') {
    return fromPasteImageEvent(event as ClipboardEvent);
  }
  if (event.type === 'drop') {
    return fromDropImageEvent(event as DragEvent);
  }
  return fromChangeEvent(event as ChangeEvent<HTMLInputElement>);
}

export const MixTogether = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const subject = useRef(new Subject<UploadEvent>());

  const { source$, upload } = useMemo(() => {
    return {
      source$: subject.current.pipe(map(mapEvent)),
      upload: (event: UploadEvent) => subject.current.next(event),
    };
  }, []);

  const image$ = useRxFileToImage(source$);

  return (
    <div>
      <div
        onPaste={upload}
        onDrop={upload}
        onDragOver={event => event.preventDefault()}
        tabIndex={1}
        onClick={() => fileInputRef.current && fileInputRef.current.click()}
        style={{
          width: '100%',
          border: '1px dashed',
          color: '#ccc',
          cursor: 'pointer',
          textAlign: 'center',
          padding: 30,
        }}
      >
        <input type="file" ref={fileInputRef} hidden onChange={upload} />
        Click or Drop an image to here
      </div>
      <Display source$={image$}></Display>
    </div>
  );
};
