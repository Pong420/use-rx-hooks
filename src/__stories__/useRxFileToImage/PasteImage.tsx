import React from 'react';
import { useRxPasteImage } from '../../useRxPasteImage';
import { Display } from './Display';

export const PasteImage = () => {
  const [image, props] = useRxPasteImage();

  return (
    <>
      <input {...props} placeholder="Paste image here" />
      <Display payload={image}></Display>
    </>
  );
};
