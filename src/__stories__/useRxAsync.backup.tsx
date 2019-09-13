import React, { useState, useCallback } from 'react';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { useRxAsync } from '../useRxAsync';
import { delay } from './utils';

type Props = ReturnType<typeof useRxAsync>;

const request = () => delay(2000).then(() => 'done!');
const request2 = () => delay(2000).then(() => Math.random());
const request3 = (result: number) => delay(2000).then(() => result);

export function Result({ loading, error, data }: Props) {
  const content = (() => {
    if (loading) {
      return 'Loading...';
    }

    if (!!error) {
      return 'Error !';
    }

    if (data) {
      if (typeof data === 'object') {
        return JSON.stringify(data, null, 2);
      }

      return data;
    }

    return ' ';
  })();

  return <pre>{content}</pre>;
}

export default {
  title: 'useRxAsync',
  parameters: {
    component: useRxAsync,
    docs: {
      container: null,
      page: null,
    },
  },
};

export const Basic = () => {
  const state = useRxAsync(request);
  return <Result {...state} />;
};

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

export const Defer = () => {
  const state = useRxAsync(request2, { defer: true });
  return (
    <>
      <button onClick={state.run}>Get Result</button>
      <Result {...state} />
    </>
  );
};

export const DynamicParameters = () => {
  const [result, setResult] = useState(0);
  const callback = useCallback(() => request3(result), [result]);
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
};

export const Pipe = () => {
  const double = (ob: Observable<number>) => ob.pipe(map(v => v * 2));

  const [result, setResult] = useState(0);
  const callback = useCallback(() => request3(result), [result]);
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
};
