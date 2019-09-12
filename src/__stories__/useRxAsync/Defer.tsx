import React from 'react';
import { useRxAsync } from '../../useRxAsync';
import { Result } from './Result';
import { delay } from '../utils';

const request = () => delay(2000).then(() => Math.random());

export function Defer() {
  const state = useRxAsync(request, { defer: true });
  return (
    <>
      <button onClick={state.run}>Get Result</button>
      <Result {...state} />
    </>
  );
}
