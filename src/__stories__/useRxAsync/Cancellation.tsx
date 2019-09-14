import React from 'react';
import { useRxAsync } from '../../useRxAsync';
import { Result, request2 } from './utils';

export const Cancellation = () => {
  const state = useRxAsync(request2, { defer: true });
  return (
    <>
      <button onClick={state.run}>Get Result</button>
      <button onClick={state.cancel}>Cancel</button>
      <Result {...state} />
    </>
  );
};
