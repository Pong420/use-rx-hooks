import { fromEvent, merge, Observable } from 'rxjs';
import { map, combineLatest, filter, startWith } from 'rxjs/operators';

export function isComposing(element: HTMLInputElement | HTMLTextAreaElement) {
  const composingStart$ = fromEvent(element, 'compositionstart').pipe(
    map(() => true)
  );
  const composingEnd$ = fromEvent(element, 'compositionend').pipe(
    map(() => false)
  );
  const isComposing$ = merge(composingStart$, composingEnd$).pipe(
    startWith(false)
  );

  return (source$: Observable<Event>) => {
    return source$.pipe(
      combineLatest(isComposing$),
      filter(([, isComposing]) => !isComposing),
      map(([evt]) => evt)
    );
  };
}
