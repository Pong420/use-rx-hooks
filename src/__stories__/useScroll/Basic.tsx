import React from 'react';
import { useRxScroll } from '../../useRxScroll';

export function Basic() {
  const [state, props] = useRxScroll();

  return (
    <div style={{ position: 'relative', height: 300 }}>
      <pre style={{ position: 'absolute', top: 0, left: 0 }}>
        {JSON.stringify(state, null, 2)}
      </pre>
      <div
        {...props}
        style={{
          overscrollBehavior: 'contain',
          overflow: 'scroll',
          position: 'absolute',
          width: '100%',
          height: 300
        }}
      >
        <div style={{ width: 5000, height: 5000 }}></div>
      </div>
    </div>
  );
}
