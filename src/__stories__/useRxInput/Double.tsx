import React from 'react';
import { useRxInput, RxInputPipe } from '../../useRxInput';
import { map, tap } from 'rxjs/operators';

const double: RxInputPipe<number | ''> = ob =>
  ob.pipe(map(v => (v ? Number(v) * 2 : '')));

export const Double = () => {
  const [value, inputProps] = useRxInput({ pipe: double });
  return (
    <>
      <input {...inputProps} />
      <pre>{value}</pre>
    </>
  );
};
