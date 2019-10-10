import React from 'react';
import { useRxInputComposing } from '../../useRxInputComposing';

export const Composing = () => {
  const [value, inputProps] = useRxInputComposing();

  return (
    <>
      <input {...inputProps} />
      <pre>{value}</pre>
    </>
  );
};
