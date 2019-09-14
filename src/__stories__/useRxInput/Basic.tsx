import React from 'react';
import { useRxInput } from '../../useRxInput';

export const Basic = () => {
  const [value, inputProps] = useRxInput();
  return (
    <>
      <input {...inputProps} />
      <pre>{value}</pre>
    </>
  );
};
