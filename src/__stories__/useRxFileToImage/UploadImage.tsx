import React from 'react';
import { useRxUploadImage } from '../../useRxUploadImage';
import { Display } from './Display';

export const UploadImage = () => {
  const [image, props] = useRxUploadImage();

  return (
    <>
      <input type="file" multiple {...props} />
      <Display payload={image}></Display>
    </>
  );
};
