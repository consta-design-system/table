// import { onEventEffect } from '##/utils/state/onEventEffect';
// import { rangeAtom } from '##/utils/state/rangeAtom';
// import { resizeObservedAtom } from '##/utils/state/resizeObservedAtom';
import {
  onEventEffect,
  rangeAtom,
  resizeObservedAtom,
} from '@consta/uikit/__internal__/src/utils/state';
import { action, atom, computed, effect, peek } from '@reatom/core';

import {
  Bounds,
  calculateBounds,
  calculateSavedSizes,
  defaultItemsCalculationCount,
  getElementHeight,
  getVisiblePosition,
  UseVirtualScrollProps,
  UseVirtualScrollReturn,
} from './helpers';

// TODO: добавить возможность указывать начальное колличество добавляемых элементов, перенести в очновной пакет, проверить в основном пакете на селектах

export const virtualScrollEffect = <
  ITEM_ELEMENT extends HTMLElement = HTMLDivElement,
  SCROLL_ELEMENT extends HTMLElement = HTMLDivElement,
>({
  length: lengthAtom,
  onEndReached,
  isActive: isActiveAtom,
  busy: busyAtom,
}: UseVirtualScrollProps): UseVirtualScrollReturn<
  ITEM_ELEMENT,
  SCROLL_ELEMENT
> => {
  const visiblePositionAtom = atom<[number, number]>([0, 0]);

  const boundsAtom = atom<Bounds>([
    [0, 0],
    [0, isActiveAtom?.() ? defaultItemsCalculationCount : lengthAtom()],
  ]);

  const spaceTopAtom = computed(() => boundsAtom()[0][0]);
  const sliceStartAtom = computed(() => boundsAtom()[1][0]);
  const sliceEndAtom = computed(() => boundsAtom()[1][1]);

  const sliceAtom = computed(
    () => [sliceStartAtom(), sliceEndAtom()] as [number, number],
  );

  const listElementsAtom = rangeAtom<ITEM_ELEMENT | null>(lengthAtom, null);

  const subscribersElements = computed(() =>
    listElementsAtom().map((el) => el()),
  );

  const scrollElementAtom = atom<SCROLL_ELEMENT | null>(null);

  const sizesAtom = resizeObservedAtom<
    ITEM_ELEMENT | null,
    number,
    (ITEM_ELEMENT | null)[]
  >(subscribersElements, getElementHeight);

  const savedSizesAtom = atom<number[]>([]);

  const scrollElementHeightAtom = resizeObservedAtom(
    scrollElementAtom,
    getElementHeight,
  );

  const maxElementHeightAtom = computed(() => {
    const el = scrollElementAtom();
    const realHeight = scrollElementHeightAtom();
    let finalHeight = realHeight;

    if (!el) return finalHeight;

    const { maxHeight } = getComputedStyle(el);
    const maxHeightInt = parseInt(maxHeight, 10);

    if (maxHeight.endsWith('px')) {
      finalHeight = parseInt(maxHeight, 10);
    }

    if (maxHeight.endsWith('%')) {
      const parent = el.parentElement;

      if (!parent) return finalHeight;
      const parentHeight = parseInt(getComputedStyle(parent).height, 10);

      finalHeight = (maxHeightInt / 100) * parentHeight;
    }

    return Math.max(finalHeight, realHeight);
  });

  const calculateVisiblePosition = action(() => {
    const scrollElement = scrollElementAtom();
    if (!scrollElement) {
      return;
    }

    const visiblePosition = getVisiblePosition(
      scrollElement.scrollTop,
      maxElementHeightAtom(),
      Math.max.apply(null, sizesAtom()),
      busyAtom?.(),
    );

    visiblePositionAtom.set((state: [number, number]) => {
      if (visiblePosition[0] !== state[0] || visiblePosition[1] !== state[1]) {
        return visiblePosition;
      }

      return state;
    });
  });

  onEventEffect(scrollElementAtom, 'scroll', calculateVisiblePosition);

  effect(() => {
    maxElementHeightAtom();

    if (isActiveAtom?.()) {
      calculateVisiblePosition();
    }
  });

  effect(() => {
    const visiblePosition = visiblePositionAtom();

    const sizes = peek(sizesAtom);
    const length = lengthAtom();

    if (isActiveAtom?.()) {
      savedSizesAtom.set(calculateSavedSizes(peek(savedSizesAtom), sizes));

      boundsAtom.set(
        calculateBounds(peek(savedSizesAtom), sizes, visiblePosition, length),
      );
    } else {
      boundsAtom.set((state) => {
        if (
          state[0][0] !== 0 ||
          state[0][1] !== 0 ||
          state[1][0] !== 0 ||
          state[1][1] !== length
        ) {
          return [
            [0, 0],
            [0, length],
          ];
        }
        return state;
      });
    }
  });

  effect(() => {
    const sliceEnd = sliceEndAtom();
    const isActive = isActiveAtom ? peek(isActiveAtom) : false;
    const length = peek(lengthAtom);

    if (isActive && onEndReached && sliceEnd === length) {
      onEndReached(length);
    }
  });

  effect(() => {
    console.log(visiblePositionAtom());
  });

  effect(() =>
    console.log(boundsAtom()[1], boundsAtom()[1][1] - boundsAtom()[1][0]),
  );

  return {
    listElementsAtom,
    scrollElementAtom,
    sliceAtom,
    spaceTopAtom,
  };
};
