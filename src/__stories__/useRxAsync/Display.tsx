import React, { CSSProperties } from 'react';
import { getErrorMessage } from './getErrorMessage';
import { RxAsyncState } from '../../useRxAsync';

type Props<T> = RxAsyncState<T> & {
  style?: CSSProperties;
};

export function Display<T>({ data, loading, error, style }: Props<T>) {
  return (
    <div style={style}>
      <pre>
        {loading ? (
          'loading...'
        ) : error ? (
          getErrorMessage(error)
        ) : data ? (
          <div>{JSON.stringify(data, null, 2)}</div>
        ) : null}
      </pre>
    </div>
  );
}
