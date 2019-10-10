import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act, Simulate } from 'react-dom/test-utils';
import { renderHook } from '@testing-library/react-hooks';
import { map } from 'rxjs/operators';
import { useRxInput, RxInputPipe } from '../useRxInput';

const double: RxInputPipe<number> = ob =>
  ob.pipe(map(v => (!isNaN(Number(v)) ? Number(v) * 2 : 0)));

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
  expect(hooks.current[0]).toEqual('');
});

test('width default value', async () => {
  const { result: hooks } = renderHook(() => useRxInput({ defaultValue: '1' }));
  expect(hooks.current[0]).toEqual('1');
});

test('with pipe', async () => {
  const { result: hooks } = renderHook(() => useRxInput({ pipe: double }));
  expect(hooks.current[0]).toEqual(0);
});

test('with default value & pipe', async () => {
  const { result: hooks } = renderHook(() =>
    useRxInput({ pipe: double, defaultValue: '1' })
  );
  expect(hooks.current[0]).toEqual(2);
});

test('on change', async () => {
  act(() => {
    render(<Input />, container);
  });

  const $input = container!.querySelector<HTMLInputElement>('input')!;
  const $value = container!.querySelector<HTMLDivElement>('.value')!;
  const newValue = '123';

  expect($value.textContent).toEqual(String('0'));

  act(() => {
    $input.value = newValue;
    Simulate.change($input);
  });

  expect($value.textContent).toEqual(String(Number(newValue) * 2));
});
