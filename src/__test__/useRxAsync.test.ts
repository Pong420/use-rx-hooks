import { renderHook, act } from '@testing-library/react-hooks';
import { useRxAsync } from '../useRxAsync';

const delay = (ms: number) => new Promise(_ => setTimeout(_, ms));
const request = () => delay(0).then(() => 1);
const errorReqest = () => delay(0).then(() => Promise.reject('error'));

test('basic', async () => {
  const { result, waitForNextUpdate } = renderHook(() => useRxAsync(request));

  expect(result.current.loading).toBe(true);
  expect(result.current.error).toBe(undefined);

  await waitForNextUpdate();

  expect(result.current.loading).toBe(false);
  expect(result.current.error).toBe(undefined);
  expect(result.current.data).toBe(1);
});

test('defer', async () => {
  const { result, waitForNextUpdate } = renderHook(() =>
    useRxAsync(request, { defer: true })
  );

  expect(result.current.loading).toBe(false);
  expect(result.current.error).toBe(undefined);
  expect(result.current.data).toBe(undefined);

  act(() => {
    result.current.run();
  });

  await waitForNextUpdate();

  expect(result.current.data).toBe(1);
});

test('cancellation', async () => {
  const { result, waitForNextUpdate } = renderHook(() => useRxAsync(request));

  expect(result.current.data).toBe(undefined);

  act(() => {
    result.current.cancel();
  });

  expect(result.current.data).toBe(undefined);

  act(() => {
    result.current.run();
  });

  await waitForNextUpdate();

  expect(result.current.data).toBe(1);

  act(() => {
    result.current.cancel();
  });

  // After cancel data should be same as before
  expect(result.current.data).toBe(1);
});

test('error', async () => {
  const { result, waitForNextUpdate } = renderHook(() =>
    useRxAsync(errorReqest)
  );

  await waitForNextUpdate();

  expect(result.current.error).toBe('error');
  expect(result.current.loading).toBe(false);
  expect(result.current.data).toBe(undefined);
});
