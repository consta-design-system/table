import { AtomMut } from '@reatom/core';
import { useAction, useAtom } from '@reatom/npm-react';
import { useLayoutEffect } from 'react';

export const useVisibleColumns = (
  refs: React.RefObject<HTMLDivElement>[],
  intersectingColumnsAtom: AtomMut<boolean[]>,
  rootAtom: AtomMut<HTMLDivElement | null>,
) => {
  const [root] = useAtom(rootAtom);
  const setIntersectingColumns = useAction(
    (ctx, index: number, value: boolean) => {
      const state = ctx.get(intersectingColumnsAtom);
      const newState = [...state];
      newState[index] = value;

      intersectingColumnsAtom(ctx, newState);
    },
  );

  useLayoutEffect(() => {
    const observers: IntersectionObserver[] = [];

    if (root) {
      for (let index = 0; index < refs.length; index++) {
        const ref = refs[index];
        const observer = new IntersectionObserver(
          (entries) => setIntersectingColumns(index, entries[0].isIntersecting),
          { root },
        );

        ref.current && observer.observe(ref.current);
      }
    }

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [refs, root]);
};
