import React from 'react';
import { merge } from 'rxjs';
import { fromDrop } from '../../useRxDropImage';
import { fromPaste } from '../../useRxPasteImage';
import { useRxFileToImage } from '../../useRxFileToImage';
import { Display } from './Display';

const merged = el => merge(fromDrop(el), fromPaste(el));

export const Window = () => {
  const [image] = useRxFileToImage(merged);
  return <Display image={image} />;
};
