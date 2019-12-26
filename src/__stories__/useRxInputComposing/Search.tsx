import React, { useEffect } from 'react';
import { useRxAsync } from '../../useRxAsync';
import { useRxInputComposing } from '../../useRxInputComposing';

const delay = (ms: number) => new Promise(_ => setTimeout(_, ms));
const asyncFn = (result: string) => delay(2000).then(() => result);

export const Search = () => {
  const [value, inputProps] = useRxInputComposing();
  const { loading, data, run } = useRxAsync(asyncFn, { defer: true });

  useEffect(() => {
    value && run(value);
  }, [run, value]);

  return (
    <>
      <pre>{loading ? 'Loading...' : data}</pre>
      <input {...inputProps} />
    </>
  );
};
