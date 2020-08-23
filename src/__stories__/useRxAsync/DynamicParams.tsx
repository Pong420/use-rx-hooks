import React, { useEffect, useCallback } from 'react';
import { useRxInput } from '../../useRxInput';
import { useRxAsync } from '../../useRxAsync';
import { Display } from './Display';

const delay = (ms: number) => new Promise(_ => setTimeout(_, ms));
const asyncFnWithParam = (result: string) =>
  delay(1000).then(() => ({ result }));

export function DynamicParams() {
  const [value, props] = useRxInput();

  const [state1, { fetch }] = useRxAsync(asyncFnWithParam, { defer: true });

  useEffect(() => fetch(value), [fetch, value]);

  // or wrapper your `asyncFn` with `useCallback`

  const request = useCallback(() => asyncFnWithParam(value), [value]);
  const state2 = useRxAsync(request);

  return (
    <div>
      <input {...props} type="text" placeholder="type something here" />
      <Display style={{ minHeight: 50 }} {...state1} />
      <Display style={{ minHeight: 50 }} {...state2} />
    </div>
  );
}
