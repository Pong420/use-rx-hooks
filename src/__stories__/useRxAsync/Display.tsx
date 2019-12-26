import React, { CSSProperties } from 'react';
import { RxAsyncState } from '../../useRxAsync';

type Props<T> = RxAsyncState<T, void> & {
  style?: CSSProperties;
};

export function Display<T>({ data, loading, error, style }: Props<T>) {
  return (
    <div style={style}>
      <pre>
        {loading ? (
          'loading...'
        ) : error ? (
          (error && error.message) || 'error'
        ) : data ? (
          <div>{JSON.stringify(data, null, 2)}</div>
        ) : null}
      </pre>
    </div>
  );
}
