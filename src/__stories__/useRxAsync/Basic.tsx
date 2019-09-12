import React from 'react';
import { useRxAsync } from '../../useRxAsync';
import { Result } from './Result';
import { delay } from '../utils';

const request = () => delay(2000).then(() => 'done!');

export function Basic() {
  const state = useRxAsync(request);
  return <Result {...state} />;
}
