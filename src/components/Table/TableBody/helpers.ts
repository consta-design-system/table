import { range } from '##/utils/array';
import { isNotNil, isNumber, isString } from '##/utils/type-guards';

import { isSizesCalculate } from './useResizableColmns/helpers';
import { UseResizableColmnsSize } from './useResizableColmns/types';

export const getStyleTopOffests = (topOffsets: number[]) => {
  const result: Record<string, string> = {};

  for (let index = 0; index < topOffsets.length; index++) {
    result[`--table-lowheader-top-offset-${index}`] = `${topOffsets[index]}px`;
  }

  return result;
};

export const getStyleByArray = <T extends number | string | undefined>(
  array: T[],
  cssVarName: string,
  print: string | ((value: T, index: number, array: T[]) => string) = 'px',
) => {
  const result: Record<string, string> = {};

  for (let index = 0; index < array.length; index++) {
    result[`${cssVarName}-${index}`] = `${
      isString(print) ? array[index] + print : print(array[index], index, array)
    }`;
  }

  return result;
};

export const getStyleLeftOffestsForStickyColumns = (
  sizes: UseResizableColmnsSize[],
) =>
  getStyleByArray(
    range(sizes.length),
    '--table-column-sticky-left-offset',
    printTableColumnStickyHorisontalOffsetValue(),
  );

export const getStyleRightOffestsForStickyColumns = (
  sizes: UseResizableColmnsSize[],
) =>
  getStyleByArray(
    range(sizes.length),
    '--table-column-sticky-right-offset',
    printTableColumnStickyHorisontalOffsetValue(true),
  );

export const getGridTamplate = (sizes: UseResizableColmnsSize[]): string =>
  sizes.map((_, index) => `var(--table-column-size-${index})`).join(' ');

const printHorisontalOffsetPart =
  (reverse: boolean, array: number[]) => (value: number) =>
    reverse
      ? `var(--table-column-size-${array.length - 1 - value})`
      : `var(--table-column-size-${value})`;

export const printTableColumnStickyHorisontalOffsetValue =
  (reverse: boolean = false) =>
  (index: number, _: number, array: number[]) => {
    const indexArray = range(reverse ? array.length - 1 - index : index);
    const value = indexArray.map(printHorisontalOffsetPart(reverse, array));

    if (!value.length) {
      return '0px';
    }

    if (value.length === 1) {
      return value[0];
    }

    return `calc(${value.join(' + ')})`;
  };

export const printSize = (value: number | undefined | string) => {
  if (isNumber(value)) {
    return `${value}px`;
  }
  if (isString(value)) {
    return value;
  }
  return 'auto';
};
