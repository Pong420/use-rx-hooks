import React from 'react';
import { useRxInput } from '../../useRxInput';

export const DefaultValue = () => {
  const [value, inputProps] = useRxInput({ defaultValue: 'Default Value' });
  return (
    <>
      <input {...inputProps} />
      <pre>{value}</pre>
    </>
  );
};
