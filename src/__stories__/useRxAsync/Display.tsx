import React from 'react';
import { useRxAsync } from '../../useRxAsync';

export function Display({ loading, error, data }: ReturnType<typeof useRxAsync>) {
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!!error) {
    return <div>Error</div>;
  }

  switch (typeof data) {
    case 'string':
    case 'number':
      return <div>{data}</div>;
    default:
      try {
        return <div>{JSON.stringify(data, null, 2)}</div>;
      } catch (error) {}
  }

  return <div>{data}</div>;
}
