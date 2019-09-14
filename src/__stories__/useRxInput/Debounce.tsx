import React from 'react';
import { useRxInput, RxInputPipe } from '../../useRxInput';
import { debounceTime } from 'rxjs/operators';

const debounce: RxInputPipe<string> = ob => ob.pipe(debounceTime(1000));

export const Debounce = () => {
  const [value, inputProps] = useRxInput({ pipe: debounce });
  return (
    <>
      <input {...inputProps} />
      <pre>{value}</pre>
    </>
  );
};
