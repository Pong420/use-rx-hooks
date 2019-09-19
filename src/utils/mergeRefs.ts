import { Ref } from 'react';

// https://github.com/facebook/react/issues/13029#issuecomment-445480443

export const mergeRefs = <T extends {}, R extends { ref: Ref<T> }>(
  ...refs: Array<R>
) => (ref: T) => {
  refs.forEach(({ ref: resolvableRef }) => {
    if (typeof resolvableRef === 'function') {
      resolvableRef(ref);
    } else {
      (resolvableRef as any).current = ref;
    }
  });
};
