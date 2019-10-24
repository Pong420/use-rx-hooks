import React, { UIEvent, useEffect } from 'react';
import { fromEvent } from 'rxjs';
import { useRxScroll } from '../../useRxScroll';

const windowScroll$ = fromEvent<UIEvent>(window, 'scroll');

export function Window() {
  const [state] = useRxScroll(windowScroll$);

  return <pre>{JSON.stringify(state, null, 2)}</pre>;
}

// or

export function Window2() {
  const [state, { onScroll }] = useRxScroll();

  useEffect(() => {
    const handler = (event: any) => onScroll(event as UIEvent);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, [onScroll]);

  return <pre>{JSON.stringify(state, null, 2)}</pre>;
}
