import React from 'react';
import { useRxInput, RxInputPipe } from '../../useRxInput';
import { map } from 'rxjs/operators';

const double: RxInputPipe<number> = ob =>
  ob.pipe(map(v => (!isNaN(Number(v)) ? Number(v) * 2 : 0)));

export const Double = () => {
  const [value, inputProps] = useRxInput({ pipe: double });
  return (
    <>
      <input {...inputProps} />
      <pre>{value}</pre>
    </>
  );
};
