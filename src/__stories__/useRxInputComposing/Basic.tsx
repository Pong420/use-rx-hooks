import React from 'react';
import { useRxInputComposing } from '../../useRxInputComposing';

export const Basic = () => {
  const [value, inputProps] = useRxInputComposing();
  return (
    <>
      <pre>{value}</pre>
      <input {...inputProps} />
    </>
  );
};
