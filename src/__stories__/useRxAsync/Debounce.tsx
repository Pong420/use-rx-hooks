import React, { useEffect } from 'react';
import { from, Observable } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { useRxAsync } from '../../useRxAsync';
import { useRxInput } from '../../useRxInput';
import { Display } from './Display';

const getGithubUserRepos = (username: string) =>
  fetch(`https://api.github.com/users/${username}/repos`)
    .then(async res => {
      const result = await res.json();
      return res.ok ? result : Promise.reject(result);
    })
    .then<string[]>(repos => repos.map(({ full_name }) => full_name));

const asyncFn = (username: string) =>
  new Observable<string>(subscriber => {
    subscriber.next(username);
  }).pipe(
    debounceTime(1000),
    switchMap(username => from(getGithubUserRepos(username)))
  );

export function Debounce() {
  const state = useRxAsync(asyncFn, { defer: true });
  const [username, props] = useRxInput();
  const { run } = state;

  useEffect(() => {
    username && run(username);
  }, [username, run]);

  return (
    <>
      <input
        {...props}
        style={{ width: 140, paddingLeft: 5 }}
        type="text"
        placeholder="input a github username"
      />
      <Display {...state}></Display>
    </>
  );
}
