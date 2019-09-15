import React from 'react';
import { useRxAsync } from '../../useRxAsync';

type Props = ReturnType<typeof useRxAsync>;

const delay = (ms: number) => new Promise(_ => setTimeout(_, ms));

export const request = () => delay(2000).then(() => 'done!');
export const request2 = () => delay(2000).then(() => Math.random());
export const request3 = (result: number) => delay(2000).then(() => result);

export function Result({ loading, error, data }: Props) {
  const content = (() => {
    if (loading) {
      return 'Loading...';
    }

    if (error) {
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
