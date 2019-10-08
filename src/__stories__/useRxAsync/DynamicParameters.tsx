import React, { useState, useCallback, useEffect } from 'react';
import { useRxAsync } from '../../useRxAsync';
import { Result, request3 } from './utils';

export const DynamicParameters = () => {
  const [params, setParams] = useState(0);
  const callback = useCallback(() => request3(params), [params]);
  const state = useRxAsync(callback, { defer: true });
  const { run } = state;

  useEffect(() => void (params && run()), [run, params]);

  return (
    <>
      <h5>Click on the button to get a params</h5>
      <button onClick={() => setParams(100)}>100</button>
      <button onClick={() => setParams(200)}>200</button>
      <button onClick={() => setParams(300)}>300</button>
      <Result {...state} />
    </>
  );
};
