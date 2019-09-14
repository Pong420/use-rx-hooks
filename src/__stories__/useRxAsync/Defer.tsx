import React from 'react';
import { useRxAsync } from '../../useRxAsync';
import { Result, request } from './utils';

export const Defer = () => {
  const state = useRxAsync(request, { defer: true });
  return (
    <>
      <button onClick={state.run}>Get Result</button>
      <Result {...state} />
    </>
  );
};
