import { useCreateAtom } from '@consta/uikit/__internal__/src/utils/state/useCreateAtom';
import { AtomMut } from '@reatom/core';
import { useAction } from '@reatom/npm-react';
import { RefObject, useLayoutEffect } from 'react';

export const useResizeObservedAtom = <
  ELEMENT extends HTMLElement | SVGGraphicsElement,
  RETURN_TYPE,
>(
  refs: Array<RefObject<ELEMENT>>,
  mapper: (el: ELEMENT | null) => RETURN_TYPE,
): AtomMut<RETURN_TYPE[]> => {
  const dimensionsAtom = useCreateAtom(refs.map((ref) => mapper(ref.current)));

  const setDimensionsAction = useAction((ctx, dimensions: RETURN_TYPE[]) => {
    dimensionsAtom(ctx, dimensions);
  });

  useLayoutEffect(() => {
    setDimensionsAction(refs.map((ref) => mapper(ref.current)));
  }, [refs]);

  useLayoutEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      setDimensionsAction(refs.map((ref) => mapper(ref.current)));
    });

    for (const ref of refs) {
      ref.current && resizeObserver.observe(ref.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [refs]);

  return dimensionsAtom;
};
