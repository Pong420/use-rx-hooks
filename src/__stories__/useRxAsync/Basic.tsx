import React from 'react';
import { useRxAsync } from '../../useRxAsync';
import { Display } from './Display';

const delay = (ms: number) => new Promise(_ => setTimeout(_, ms));

const asyncFn = () =>
  delay(2000).then(() =>
    fetch('https://api.github.com/repos/pong420/use-rx-hooks')
      .then(res => res.json())
      .then(data => {
        if (data) {
          const { name } = data;
          return {
            name,
            watch: data.watchers_count,
            star: data.stargazers_count,
            fork: data.forks_count,
          };
        }
      })
  );

export function Basic() {
  const state = useRxAsync(asyncFn);
  return (
    <>
      <button onClick={state.run}>Reload</button>
      <Display style={{ minHeight: 100 }} {...state} />
    </>
  );
}
