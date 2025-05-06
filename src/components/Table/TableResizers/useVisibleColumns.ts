import { AtomMut } from '@reatom/core';
import { useAction } from '@reatom/npm-react';
import { useLayoutEffect } from 'react';

export const useVisibleColumns = (
  refs: React.RefObject<HTMLDivElement>[],
  intersectingColumnsAtom: AtomMut<boolean[]>,
) => {
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

    for (let index = 0; index < refs.length; index++) {
      const ref = refs[index];
      const observer = new IntersectionObserver(
        (entries) => {
          setIntersectingColumns(index, entries[0].isIntersecting);
        },
        { rootMargin: '10000px 80px 10000px 80px' },
      );

      ref.current && observer.observe(ref.current);
    }

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [refs]);
};
