import React, { useState, useCallback } from 'react';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { useRxAsync } from '../../useRxAsync';
import { Result, request3 } from './utils';

export const Pipe = () => {
  const double = (ob: Observable<number>) => ob.pipe(map(v => v * 2));

  const [result, setResult] = useState(0);
  const callback = useCallback(() => request3(result), [result]);
  const state = useRxAsync(callback, { defer: true, pipe: double });

  return (
    <>
      <button onClick={() => setResult(100)}>100</button>
      <button onClick={() => setResult(200)}>200</button>
      <button onClick={() => setResult(300)}>300</button>
      <Result {...state} />
    </>
  );
};
