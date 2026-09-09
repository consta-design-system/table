import {
  abortVar,
  action,
  Atom,
  AtomLike,
  effect,
  peek,
  reatomArray,
} from '@reatom/core';

export const visibleColumnsEffect = (
  elementsAtom: AtomLike<AtomLike<HTMLDivElement | null>[]>,
  intersectingColumnsAtom: Atom<boolean[]>,
  rootAtom: AtomLike<HTMLDivElement | null>,
) => {
  const setIntersectingColumns = action((index: number, value: boolean) => {
    const newState = [...intersectingColumnsAtom()];
    newState[index] = value;

    intersectingColumnsAtom.set(newState);
  });

  const observersAtom = reatomArray<IntersectionObserver>([]);

  const disconnectObservers = action(() => {
    observersAtom().forEach((observer) => observer.disconnect());
  });

  effect(() => {
    const root = rootAtom();
    const elements = elementsAtom();

    disconnectObservers();
    observersAtom.set([]);

    if (root) {
      for (let index = 0; index < elements.length; index++) {
        const element = peek(elements[index]);
        const observer = new IntersectionObserver(
          (entries) => setIntersectingColumns(index, entries[0].isIntersecting),
          { root },
        );

        observersAtom.push(observer);

        element && observer.observe(element);
      }
    }
  });

  abortVar.subscribe(disconnectObservers);
};
