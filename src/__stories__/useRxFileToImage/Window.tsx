import React from 'react';
import { merge } from 'rxjs';
import { fromDropEvent } from '../../useRxDropImage';
import { fromPasteEvent } from '../../useRxPasteImage';
import { useRxFileToImage } from '../../useRxFileToImage';
import { Display } from './Display';

const merged = () => merge(fromDropEvent(window), fromPasteEvent(window));

export const Window = () => {
  const [image] = useRxFileToImage(merged);
  return <Display image={image} />;
};
