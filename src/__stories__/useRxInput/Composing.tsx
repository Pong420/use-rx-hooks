import React from 'react';
import { useRxInput } from '../../useRxInput';
import { isComposing } from '../../utils/isComposing';

// You could import `isComposing` from this library

export const Composing = () => {
  const [value, inputProps] = useRxInput<HTMLInputElement>({ interceptors: isComposing });
  return (
    <>
      <input {...inputProps} />
      <pre>{value}</pre>
    </>
  );
};
