import React, { useState, useCallback, useEffect } from 'react';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { useRxAsync } from '../../useRxAsync';
import { Result, request3 } from './utils';

const double = (ob: Observable<number>) => ob.pipe(map(v => v * 2));

export const Pipe = () => {
  const [params, setParams] = useState(0);
  const callback = useCallback(() => request3(params), [params]);
  const state = useRxAsync(callback, { defer: true, pipe: double });
  const { run } = state;

  useEffect(() => void (params && run()), [run, params]);

  return (
    <>
      <button onClick={() => setParams(100)}>100</button>
      <button onClick={() => setParams(200)}>200</button>
      <button onClick={() => setParams(300)}>300</button>
      <Result {...state} />
    </>
  );
};
