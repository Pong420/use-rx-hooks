import React from 'react';
import { useRxDropImage } from '../../useRxDropImage';
import { Display } from './Display';

export const DropImage = () => {
  const [image, props] = useRxDropImage();

  return (
    <>
      <div
        {...props}
        style={{
          width: '100%',
          border: '1px dashed',
          color: '#ccc',
          textAlign: 'center',
          padding: 30,
        }}
      >
        Drop an image to here
      </div>
      <Display payload={image}></Display>
    </>
  );
};
