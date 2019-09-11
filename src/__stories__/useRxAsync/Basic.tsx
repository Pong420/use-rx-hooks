import React from 'react';
import { useRxAsync } from '../../useRxAsync';
import { Display } from './Display';
import { delay } from '../utils';

const request = () => delay(2000).then(() => 'done!');

export function Basic() {
  const state = useRxAsync(request);
  return <Display {...state} />;
}
