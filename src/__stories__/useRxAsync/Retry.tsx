import React from 'react';
import { from, of, throwError } from 'rxjs';
import { delay, switchMap, retryWhen } from 'rxjs/operators';
import { useRxAsync } from '../../useRxAsync';
import { Display } from './Display';

const request = () =>
  Math.random() > 0.5
    ? fetch('https://api.github.com/repos/pong420/use-rx-hooks')
        .then(res => res.json())
        .then(data => {
          if (data) {
            const { name } = data;
            return {
              name,
              watch: data.watchers_count,
              star: data.stargazers_count,
              fork: data.forks_count
            };
          }
        })
    : Promise.reject('You may click the button to try again');

const asyncFn = () =>
  from(request()).pipe(
    retryWhen(errors =>
      errors.pipe(
        switchMap((error, index) =>
          index === 3 ? throwError(error) : of(error)
        ),
        delay(1000)
      )
    )
  );

export function Retry() {
  const [state, { fetch }] = useRxAsync(asyncFn, { defer: true });

  return (
    <>
      <button onClick={fetch}>Run</button>
      <Display style={{ minHeight: 100 }} {...state}></Display>
    </>
  );
}
