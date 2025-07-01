import { objectWithDefault } from '@consta/uikit/__internal__/src/utils/object/objectWithDefault';
import { useCreateAtom } from '@consta/uikit/__internal__/src/utils/state/useCreateAtom';
import { usePropAtom } from '@consta/uikit/__internal__/src/utils/state/usePickAtom';
import { useSendToAtom } from '@consta/uikit/__internal__/src/utils/state/useSendToAtom';
import { useAction, useAtom, useUpdate } from '@reatom/npm-react';
import { createRef, useMemo, useRef } from 'react';

import { useResizeObservedAtom } from '../useResizeObservedAtom';
import {
  arraysIsEq,
  Bounds,
  calculateBounds,
  calculateSavedSizes,
  defaultItemsCalculationCount,
  getElementHeight,
  getVisiblePosition,
  useScroll,
  UseVirtualScrollProps,
  UseVirtualScrollReturn,
} from './helpers';

const visiblePositionInitial: [number, number] = [0, 0];

export const useVirtualScrollAtom = <
  ITEM_ELEMENT extends HTMLElement = HTMLDivElement,
  SCROLL_ELEMENT extends HTMLElement = HTMLDivElement,
>(
  props: UseVirtualScrollProps,
): UseVirtualScrollReturn<ITEM_ELEMENT, SCROLL_ELEMENT> => {
  const propsWithDefault = objectWithDefault({ isActive: false }, props);
  const propsAtom = useSendToAtom(propsWithDefault);
  const lengthAtom = usePropAtom(propsAtom, 'length');
  const isActiveAtom = usePropAtom(propsAtom, 'isActive');
  const onScrollToBottomAtom = usePropAtom(propsAtom, 'onScrollToBottom');

  const visiblePositionAtom = useCreateAtom(visiblePositionInitial);

  const boundsAtom = useCreateAtom<Bounds>([
    [0, 0],
    [
      0,
      propsWithDefault.isActive
        ? defaultItemsCalculationCount
        : propsWithDefault.length,
    ],
  ]);

  const setBoundsAction = useAction((ctx, value: Bounds) => {
    const currentValue = ctx.get(boundsAtom);
    if (
      !arraysIsEq(currentValue[0], value[0]) ||
      !arraysIsEq(currentValue[1], value[1])
    ) {
      boundsAtom(ctx, value);
    }
  });

  const sliceStartAtom = useCreateAtom((ctx) => ctx.spy(boundsAtom)[1][0]);
  const sliceEndAtom = useCreateAtom((ctx) => {
    const sliceEnd = ctx.spy(boundsAtom)[1][1];
    return sliceEnd < 50 ? 50 : sliceEnd;
  });
  const sliceAtom = useCreateAtom<[number, number]>((ctx) => [
    ctx.spy(sliceStartAtom),
    ctx.spy(sliceEndAtom),
  ]);

  const spaceTopAtom = useCreateAtom((ctx) => ctx.spy(boundsAtom)[0][0]);

  const listRefsAtom = useCreateAtom((ctx) => {
    const length = ctx.spy(lengthAtom);
    ctx.spy(visiblePositionAtom);
    return new Array(length).fill(null).map(createRef<ITEM_ELEMENT>);
  });

  const scrollElementRef = useRef<SCROLL_ELEMENT>(null);
  const sizesAtom = useResizeObservedAtom(
    useAtom(listRefsAtom)[0],
    getElementHeight,
  );

  const savedSizesAtom = useCreateAtom<number[]>([]);

  const scrollElementRefHeightArrayAtom = useResizeObservedAtom(
    useMemo(() => {
      return [scrollElementRef];
    }, [scrollElementRef]),
    getElementHeight,
  );

  const scrollElementRefHeightAtom = useCreateAtom((ctx) => {
    return ctx.spy(scrollElementRefHeightArrayAtom)[0];
  });

  const calculateVisiblePosition = useAction((ctx) => {
    const scrollElement = scrollElementRef.current;
    if (!scrollElement) {
      return;
    }

    const elementMaxSize = Math.max.apply(null, ctx.get(sizesAtom));

    const visiblePosition = getVisiblePosition(
      scrollElement.scrollTop,
      getElementHeight(scrollElement),
      elementMaxSize,
    );

    const state = ctx.get(visiblePositionAtom);
    if (visiblePosition[0] !== state[0] || visiblePosition[1] !== state[1]) {
      visiblePositionAtom(ctx, visiblePosition);
    }
  });

  useScroll(
    scrollElementRef,
    calculateVisiblePosition,
    propsWithDefault.isActive,
  );

  useUpdate(calculateVisiblePosition, [
    scrollElementRefHeightAtom,
    isActiveAtom,
  ]);

  useUpdate(
    (ctx, visiblePosition, sizes, length, isActive) => {
      if (isActive) {
        const savedSizes = ctx.get(savedSizesAtom);
        const newSavedSizes = calculateSavedSizes(savedSizes, sizes);

        savedSizesAtom(ctx, newSavedSizes);

        setBoundsAction(
          calculateBounds(newSavedSizes, sizes, visiblePosition, length),
        );
      } else {
        const state = ctx.get(boundsAtom);
        if (
          state[0][0] !== 0 ||
          state[0][1] !== 0 ||
          state[1][0] !== 0 ||
          state[1][1] !== length
        ) {
          setBoundsAction([
            [0, 0],
            [0, length],
          ]);
        }
      }
    },
    [visiblePositionAtom, sizesAtom, lengthAtom, isActiveAtom],
  );

  useUpdate(
    (ctx, slice) => {
      const length = ctx.get(lengthAtom);
      const onScrollToBottom = ctx.get(onScrollToBottomAtom);
      if (onScrollToBottom && slice >= length) {
        onScrollToBottom(length);
      }
    },
    [sliceEndAtom],
  );

  useUpdate(
    (ctx, isActive) => {
      const length = ctx.get(lengthAtom);
      const bounds = ctx.get(boundsAtom);
      const visiblePosition = ctx.get(visiblePositionAtom);
      const resetVisiblePosition: [number, number] = [0, 0];
      const resetBounds: Bounds = [
        [0, 0],
        [0, isActive ? defaultItemsCalculationCount : length],
      ];

      if (
        !(
          arraysIsEq(bounds[0], resetBounds[0]) &&
          arraysIsEq(bounds[1], resetBounds[1])
        )
      ) {
        boundsAtom(ctx, resetBounds);
      }

      if (!arraysIsEq(visiblePosition, resetVisiblePosition)) {
        visiblePositionAtom(ctx, resetVisiblePosition);
      }
    },
    [isActiveAtom],
  );

  return {
    listRefsAtom,
    scrollElementRef,
    sliceAtom,
    spaceTopAtom,
  };
};
