import React from 'react';
import { useRxAsync } from '../../useRxAsync';
import { Result, request } from './utils';

export const Basic = () => {
  const state = useRxAsync(request);
  return <Result {...state} />;
};
