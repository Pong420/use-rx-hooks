import React, { CSSProperties, useEffect, useState } from 'react';
import { Observable } from 'rxjs';
import { RxFileToImageState } from '../../useRxFileToImage';

interface Props {
  source$?: Observable<RxFileToImageState>;
}

const style: CSSProperties = {
  display: 'flex',
  marginTop: 10,
  backgroundColor: 'rgb(242, 242, 242)',
  padding: 10,
};

const imageContainerStyle: CSSProperties = {
  alignSelf: 'center',
  maxWidth: 200,
  marginRight: 10,
};

export function Display({ source$ }: Props) {
  const [images, setImages] = useState<RxFileToImageState[]>([]);

  useEffect(() => {
    const subscription = source$.subscribe(payload =>
      setImages(curr => [...curr, payload])
    );
    return () => subscription.unsubscribe();
  }, [source$]);

  return (
    <div>
      {images.map(({ url, ...rest }, index) => (
        <div key={index} style={style}>
          <div className="image" style={imageContainerStyle}>
            <img src={url} alt="" width="100%" />
          </div>
          <pre className="json">{JSON.stringify(clone(rest), null, 2)}</pre>
        </div>
      ))}
    </div>
  );
}

function clone({ file, ...rest }: any) {
  if (file) {
    return {
      file: {
        lastModified: file.lastModified,
        name: file.name,
        size: file.size,
        type: file.type,
      },
      ...rest,
    };
  }

  return {};
}
