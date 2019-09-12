# useRxAsync

```js
const state = useRxAsync(input, options?);
```

## Input

Same as `from` in `rxjs`, Array, Promise like, or Iterable

## Options (optional)

| key          | type                     | description                                   |
| ------------ | ------------------------ | --------------------------------------------- |
| defer        | boolean                  | if defer is ture, it will not run after mount |
| pipe         | (obervable) => obervable | rxjs pipe                                     |
| onSuccess    | (result) => void         |
| onFailure    | (result) => void         |
| initialValue | unknown                  |

## State

| key     | type       |
| ------- | ---------- |
| loading | boolean    |
| error   | any        |
| data    | unknown    |
| run     | () => void |
| cancel  | () => void |

## Usage

```js
const getResult = params => fetch('http://api.com', params);

function Component(params) {
  const callback = useCallback(() => getResult(params), [params]);
  const { data, loading, error } = useRxAsync(callback);

  if (loading) {
    return 'Loading...';
  }

  if (!!error) {
    return 'Error !';
  }

  return data;
}
```
