import React, { useState, useCallback } from 'react';
import { useRxAsync } from '../../useRxAsync';
import { Result } from './Result';
import { delay } from '../utils';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const request = (result: number) => delay(2000).then(() => result);
const double = (ob: Observable<number>) => ob.pipe(map(v => v * 2));

export function Transform() {
  const [result, setResult] = useState(0);
  const callback = useCallback(() => request(result), [result]);
  const state = useRxAsync(callback, { defer: true, pipe: double });

  return (
    <>
      <h5>Click on the button to get a result, the result will be double</h5>
      <button onClick={() => setResult(100)}>100</button>
      <button onClick={() => setResult(200)}>200</button>
      <button onClick={() => setResult(300)}>300</button>
      <Result {...state} />
    </>
  );
}
