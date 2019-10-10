# use-rx-hooks

> react hooks with rxjs

```
yarn add use-rx-hooks
```

```js
import { useRxAsync } from 'use-rx-hooks';

function Component() {
  const { data, loading, error, cancel, reset } = useRxAsync(fn);

  if (loading) {
    return 'loading...';
  }

  if (error) {
    return 'error!';
  }

  return data;
}
```

[More hooks & Docs](https://pong420.github.io/use-rx-hooks/?path=/story/userxasync--page)

## License

[MIT](LICENSE)
