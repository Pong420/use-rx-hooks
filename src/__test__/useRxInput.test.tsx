import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { renderHook } from '@testing-library/react-hooks';
import { map, tap } from 'rxjs/operators';
import { useRxInput, RxInputPipe } from '../useRxInput';

const double: RxInputPipe<number> = ob =>
  ob.pipe(
    map(v => (!isNaN(Number(v)) ? Number(v) * 2 : 0)),
    tap(console.log)
  );

function Input() {
  const [value, props] = useRxInput({ pipe: double });
  return (
    <>
      <input {...props} />
      <div className="value">{value}</div>
    </>
  );
}

let container: HTMLDivElement | null = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container!);
  container!.remove();
  container = null;
});

test('initial value', async () => {
  const { result: hooks } = renderHook(() => useRxInput());
  const { result: hooksWithPipe } = renderHook(() =>
    useRxInput({ pipe: double })
  );

  expect(hooks.current[0]).toEqual('');
  expect(hooksWithPipe.current[0]).toEqual(undefined);
});

test('with pipe', async () => {
  act(() => {
    render(<Input />, container);
  });
  const $value = container!.querySelector<HTMLDivElement>('.value')!;
  expect($value.textContent).toEqual('0');
});

test('typing', async () => {
  act(() => {
    render(<Input />, container);
  });
  const $input = container!.querySelector<HTMLInputElement>('input')!;
  const $value = container!.querySelector<HTMLDivElement>('.value')!;
  const newValue = '123';

  act(() => {
    $input.value = newValue;
    $input.dispatchEvent(new Event('input'));
  });

  expect($value.textContent).toEqual(String(Number(newValue) * 2));
});
