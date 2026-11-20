import {
  computedSet,
  resizeObservedAtom,
} from '@consta/uikit/__internal__/src/utils/state';
import {
  abortVar,
  action,
  atom,
  AtomLike,
  computed,
  effect,
  peek,
  sleep,
  withAbort,
  wrap,
} from '@reatom/core';

import {
  addResult,
  getBlockMaxSizes,
  getCalculatedSizes,
  getContainerWidth,
  getRefsSizes,
  getResizeResult,
  getSizesSum,
  getValidValues,
  isSizesCalculate,
  minMax,
  sizesEq,
} from './helpers';
import { ResizableColumnsProps } from './types';

export const resizableColumns = (
  ...[
    blocksAtom,
    containerAtom,
    resizableAtom,
    onAfterResize,
  ]: ResizableColumnsProps
) => {
  const firstRenderAtom = atom(true);
  const blocksLengthAtom = computed(() => blocksAtom().length);
  const sizesAtom = computedSet(() => getRefsSizes(blocksAtom()));
  const activeIndexAtom = atom<number | null>(null);
  const resizingAtom = computed(() => typeof activeIndexAtom() === 'number');
  const setSizes = action((newSizes: (string | number | undefined)[]) => {
    if (!sizesEq(newSizes, sizesAtom())) {
      sizesAtom.set(newSizes);
    }
  });
  const controlListeners = action((type: 'add' | 'remove') => {
    const method = type === 'add' ? 'addEventListener' : 'removeEventListener';
    document[method]('mouseup', handleRelease);
    document[method]('touchend', handleRelease);
    document[method]('mousemove', handleTouchMove);
    document[method]('touchmove', handleTouchMove);
  });

  const handleRelease = action(() => {
    if (typeof activeIndexAtom() === 'number') {
      onAfterResize(getResizeResult(blocksAtom(), sizesAtom()));
    }

    activeIndexAtom.set(null);
    controlListeners('remove');
  });

  const handlePress = action((index: number) => {
    activeIndexAtom.set(index);
    controlListeners('add');
  });

  const handleTouchMove = action((event: MouseEvent | TouchEvent | Event) => {
    const activeIndex = activeIndexAtom();
    const resizable = resizableAtom();

    if (typeof activeIndex === 'number' && resizable) {
      setSizes(
        addResult(
          getCalculatedSizes(
            event,
            activeIndex,
            blocksAtom(),
            containerAtom(),
            sizesAtom(),
            resizable,
          ),
          sizesAtom(),
        ),
      );
    }
  });

  const handlersAtom = atom(() => {
    const resizable = resizableAtom();
    const blocksLength = blocksLengthAtom();

    if (!resizable) {
      return [];
    }

    return Array.from({ length: blocksLength }).map((_el, index) => ({
      onMouseDown: () => handlePress(index),
      onTouchStart: () => handlePress(index),
    }));
  });

  const containerResizeHandler = action(async (el: HTMLDivElement | null) => {
    await wrap(sleep(10));

    const containerWidth = getContainerWidth(el);

    const newSizes = [...sizesAtom()];

    if (containerWidth && isSizesCalculate(newSizes)) {
      const sizesSum = getSizesSum(newSizes);
      let gap = containerWidth - sizesSum;

      if (
        (resizableAtom() !== 'outside' && gap) ||
        (resizableAtom() === 'outside' && gap > 0)
      ) {
        let index = blocksAtom().length - 1;

        while (newSizes[index] && gap) {
          const blockMinMax = getBlockMaxSizes(blocksAtom()[index]);
          const newSize =
            minMax(blockMinMax[0], blockMinMax[1], newSizes[index] + gap) || 0;

          gap -= newSize - newSizes[index];
          newSizes[index] = newSize;
          index -= 1;
        }
      }

      setSizes(newSizes);

      if (firstRenderAtom()) {
        firstRenderAtom.set(false);
      }
    }
  }).extend(withAbort());

  resizeObservedAtom(
    containerAtom as AtomLike<HTMLDivElement>,
    wrap(containerResizeHandler),
  );

  // Фикс поджимает последнюю колонку в случае появления "Лишнего" горизонтального скролла

  effect(async () => {
    const firstRender = firstRenderAtom();
    await wrap(sleep(0));
    const el = peek(containerAtom);
    const sizes = peek(sizesAtom);
    const lastIndex = sizes.length - 1;
    const lastSize = sizes[lastIndex];

    if (!el || typeof lastSize !== 'number') {
      return;
    }

    const newLastSize = lastSize - (el.offsetWidth - el.clientWidth);

    if (!firstRender) {
      setSizes(
        addResult(
          getValidValues(
            newLastSize,
            lastIndex,
            peek(blocksAtom),
            getContainerWidth(el) || 0,
            sizes,
            peek(resizableAtom),
          ),
          sizes,
        ),
      );
    }
  });

  effect(() => {
    if (resizableAtom()) {
      handleRelease();
    }
  });

  abortVar.subscribe(handleRelease);

  return {
    handlersAtom,
    sizesAtom,
    activeIndexAtom,
    resizingAtom,
  };
};
