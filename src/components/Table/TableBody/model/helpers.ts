import { trackPosition } from '@consta/uikit/__internal__/src/components/Slider/useSlider/helper';

import { TableColumnResizeResult } from '../../types';
import { ResizableColumnsBlock, ResizableColumnsSize } from './types';

export const minMax = (min?: number, max?: number, value?: number) => {
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

export const getContainerWidth = (el?: HTMLElement | null) =>
  el
    ? Math.floor(
        el.clientWidth - (el.offsetWidth - el.getBoundingClientRect().width),
      )
    : undefined;

export const getRefsSizes = (
  blocks: ResizableColumnsBlock[],
): (number | string | undefined)[] => {
  let gap = 0;

  return blocks.map(({ element, maxWidth, minWidth, width }) => {
    const value =
      minMax(minWidth, maxWidth, element?.getBoundingClientRect().width) ||
      (typeof width === 'number' ? minMax(minWidth, maxWidth, width) : width);

    if (typeof value === 'number') {
      const roundValue = Math.floor(value + gap);

      gap += value - roundValue;

      return roundValue;
    }

    return value;
  });
};

const getTargetBlockPosition = (sizes: ResizableColumnsSize[], index: number) =>
  sizes
    .slice(0, index)
    .map((el) => (typeof el === 'number' ? el : 0))
    .reduce((val, a) => (val ?? 0) + (a ?? 0), 0);

export const getBlockMaxSizes = (block: ResizableColumnsBlock | undefined) => {
  return [block?.minWidth || 0, block?.maxWidth] as const;
};

type GetValidValuesResult = [number, number][];

export const addResult = <T extends ResizableColumnsSize>(
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

export const getSizesSum = (sizes: number[]) => sizes.reduce((a, b) => a + b);

export const getResizeResult = (
  blocks: ResizableColumnsBlock[],
  sizes: ResizableColumnsSize[],
): TableColumnResizeResult[] =>
  blocks.reduce<TableColumnResizeResult[]>((result, block, index) => {
    const width = sizes[index];

    if (block.accessor && typeof width === 'number') {
      result.push({ accessor: block.accessor, width });
    }

    return result;
  }, []);

const getValidValues = (
  value: number,
  index: number,
  blocks: ResizableColumnsBlock[],
  containerWidth: number,
  sizes: ResizableColumnsSize[],
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

  if (resizable === 'inside' && sizesSum !== containerWidth) {
    return [];
  }

  if (resizable === 'outside' && sizesSum < containerWidth) {
    newSizes.splice(index, 1, 0);

    return [[index, containerWidth - getSizesSum(newSizes)]];
  }

  return results;
};

export const getCalculatedSizes = (
  event: MouseEvent | TouchEvent | Event,
  index: number,
  blocks: ResizableColumnsBlock[],
  container: HTMLElement | null,
  sizes: ResizableColumnsSize[],
  resizable: 'inside' | 'outside',
): [number, ResizableColumnsSize][] => {
  const position = trackPosition(event as MouseEvent | TouchEvent)?.x;

  if (position) {
    const containerWidth = getContainerWidth(container) || 0;
    const containerLeft = container?.getBoundingClientRect().left || 0;
    const scrollLeft = container?.scrollLeft || 0;
    const trackPosition = getTargetBlockPosition(sizes, index);

    const value = Math.floor(
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
