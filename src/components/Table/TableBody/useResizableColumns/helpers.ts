import { trackPosition } from '@consta/uikit/__internal__/src/components/Slider/useSlider/helper';
import { useDebounce } from '@consta/uikit/useDebounce';
import { useResizeObserved } from '@consta/uikit/useResizeObserved';
import React, { useMemo } from 'react';

import { UseResizableColumnsBlock, UseResizableColumnsSize } from './types';

const minMax = (min?: number, max?: number, value?: number) => {
  if (typeof value === 'number') {
    if (max && min) {
      return Math.min(max, Math.max(min, value));
    }
    if (max) {
      return Math.min(max, value);
    }
    if (min) {
      return Math.max(min, value);
    }
    return value;
  }
  if (max === min) {
    return max;
  }
  return value;
};

export const sizesEq = (
  newSizes: (string | number | undefined)[],
  sizes: (string | number | undefined)[],
) => newSizes.join('-') === sizes.join('-');

export const getRefsSizes = (
  blocks: UseResizableColumnsBlock[],
): (number | string | undefined)[] => {
  let gap = 0;

  return blocks.map(({ ref, maxWidth, minWidth, width }) => {
    const value =
      minMax(minWidth, maxWidth, ref.current?.getBoundingClientRect().width) ||
      (typeof width === 'number' ? minMax(minWidth, maxWidth, width) : width);

    if (typeof value === 'number') {
      const roundValue = Math.round(value + gap);
      gap += value - roundValue;

      return roundValue;
    }

    return value;
  });
};

const getTargetBlockPosition = (
  sizes: UseResizableColumnsSize[],
  index: number,
) =>
  sizes
    .slice(0, index)
    .map((el) => (typeof el === 'number' ? el : 0))
    .reduce((val, a) => (val ?? 0) + (a ?? 0), 0);

const getBlockMaxSizes = (block: UseResizableColumnsBlock | undefined) => {
  return [block?.minWidth || 0, block?.maxWidth] as const;
};

type GetValidValuesResult = [number, number][];

export const addResult = <T extends UseResizableColumnsSize>(
  result: [number, T][],
  sizes: T[],
): T[] => {
  const newSizes = [...sizes];
  for (let index = 0; index < result.length; index++) {
    // eslint-disable-next-line prefer-destructuring
    newSizes[result[index][0]] = result[index][1];
  }

  return newSizes;
};

export const isSizesCalculate = (
  sizes: (number | string | undefined)[],
): sizes is number[] =>
  !sizes.find(
    (item) => typeof item === 'string' || typeof item === 'undefined',
  );

export const getSizesSum = (sizes: number[]) =>
  sizes.reduce((a, b) => {
    return a + b;
  });

const getValidValues = (
  value: number,
  index: number,
  blocks: UseResizableColumnsBlock[],
  containerWidth: number,
  sizes: UseResizableColumnsSize[],
  resizable: 'inside' | 'outside',
): GetValidValuesResult => {
  const currentMinMax = getBlockMaxSizes(blocks[index]);

  const guardValue = minMax(currentMinMax[0], currentMinMax[1], value) || 0;

  const results: GetValidValuesResult = [[index, guardValue]];

  const newSizes = [...sizes].map((size) =>
    typeof size === 'number' ? size : 0,
  );
  newSizes.splice(index, 1, guardValue);

  const newSizesSum = getSizesSum(newSizes);

  let nextIndex = blocks.length - 1;

  while (newSizes[nextIndex] && nextIndex > index && resizable === 'inside') {
    const gap = containerWidth - newSizesSum;

    const nextMinMax = getBlockMaxSizes(blocks[nextIndex]);
    const nextValue =
      minMax(nextMinMax[0], nextMinMax[1], newSizes[nextIndex] + gap) || 0;

    if (
      newSizes[nextIndex] + gap !== nextValue ||
      nextValue === results[0][1]
    ) {
      nextIndex -= 1;
      continue;
    }

    results.push([nextIndex, nextValue]);

    if (newSizesSum + gap === containerWidth) {
      break;
    }

    nextIndex -= 1;
  }

  const sizesSum = getSizesSum(addResult(results, newSizes));

  if (
    (resizable === 'inside' && sizesSum !== containerWidth) ||
    (resizable === 'outside' && sizesSum < containerWidth)
  ) {
    return [];
  }

  return results;
};

export const getCalculatedSizes = (
  event: MouseEvent | TouchEvent | Event,
  index: number,
  blocks: UseResizableColumnsBlock[],
  container: React.RefObject<HTMLElement>,
  sizes: UseResizableColumnsSize[],
  resizable: 'inside' | 'outside',
): [number, UseResizableColumnsSize][] => {
  const position = trackPosition(event as MouseEvent | TouchEvent)?.x;

  if (position) {
    const containerWidth = container.current?.clientWidth || 0;
    const containerLeft = container.current?.getBoundingClientRect().left || 0;
    const scrollLeft = container.current?.scrollLeft || 0;
    const trackPosition = getTargetBlockPosition(sizes, index);

    const value = Math.round(
      position + scrollLeft - containerLeft - trackPosition,
    );

    return getValidValues(
      value,
      index,
      blocks,
      containerWidth,
      sizes,
      resizable,
    );
  }

  return [];
};

export const useResizeContainer = (
  containerRef: React.RefObject<HTMLElement>,
  refs: React.MutableRefObject<
    readonly [
      React.RefObject<HTMLElement>,
      UseResizableColumnsBlock[],
      'inside' | 'outside' | undefined,
      number | null,
      (string | number | undefined)[],
    ]
  >,
  set: (newSizes: (string | number | undefined)[]) => void,
) =>
  useResizeObserved(
    useMemo(() => [containerRef], [containerRef]),
    useDebounce((el) => {
      const containerWidth = el?.clientWidth;
      const newSizes = [...refs.current[4]];
      const resizable = refs.current[2];

      if (containerWidth && isSizesCalculate(newSizes)) {
        const blocks = refs.current[1];
        const sizesSum = getSizesSum(newSizes);
        let gap = containerWidth - sizesSum;

        if (
          (resizable !== 'outside' && gap) ||
          (resizable === 'outside' && gap > 0)
        ) {
          let index = blocks.length - 1;

          while (newSizes[index] && gap) {
            const blockMinMax = getBlockMaxSizes(blocks[index]);
            const size = newSizes[index];
            const newSize =
              minMax(blockMinMax[0], blockMinMax[1], newSizes[index] + gap) ||
              0;

            gap -= newSize - size;

            newSizes[index] = newSize;

            index -= 1;
          }
        }
        set(newSizes);
      }
    }, 10),
  );
