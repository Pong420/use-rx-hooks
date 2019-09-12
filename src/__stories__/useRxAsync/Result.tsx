import React from 'react';
import { useRxAsync } from '../../useRxAsync';

type Props = ReturnType<typeof useRxAsync>;

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
