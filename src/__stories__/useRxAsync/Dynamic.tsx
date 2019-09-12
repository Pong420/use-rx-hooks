import React, { useState, useCallback } from 'react';
import { useRxAsync } from '../../useRxAsync';
import { Result } from './Result';
import { delay } from '../utils';

const request = (result: number) => delay(2000).then(() => result);

export function Dynamic() {
  const [result, setResult] = useState(0);
  const callback = useCallback(() => request(result), [result]);
  const state = useRxAsync(callback, { defer: true });

  return (
    <>
      <h5>Click on the button to get a result</h5>
      <button onClick={() => setResult(100)}>100</button>
      <button onClick={() => setResult(200)}>200</button>
      <button onClick={() => setResult(300)}>300</button>
      <Result {...state} />
    </>
  );
}
