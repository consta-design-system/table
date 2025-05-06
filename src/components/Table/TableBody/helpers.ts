import { range } from '##/utils/array';
import { isNumber, isString } from '##/utils/type-guards';

export const getStyleTopOffsets = (topOffsets: number[]) => {
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
  let result = '';

  for (let index = 0; index < array.length; index++) {
    result += `${cssVarName}-${index}: ${
      isString(print) ? array[index] + print : print(array[index], index, array)
    }; `;
  }

  return result;
};

export const getStyleLeftOffsetsForStickyColumns = (length: number) =>
  getStyleByArray(
    range(length),
    '--table-column-sticky-left-offset',
    printTableColumnStickyHorizontalOffsetValue(),
  );

export const getStyleRightOffsetsForStickyColumns = (length: number) =>
  getStyleByArray(
    range(length),
    '--table-column-sticky-right-offset',
    printTableColumnStickyHorizontalOffsetValue(true),
  );

export const getGridTemplate = (length: number): string =>
  [...Array(length)]
    .map((_, index) => `var(--table-column-size-${index})`)
    .join(' ');

const printHorizontalOffsetPart =
  (reverse: boolean, array: number[]) => (value: number) =>
    reverse
      ? `var(--table-column-size-${array.length - 1 - value})`
      : `var(--table-column-size-${value})`;

const printTableColumnStickyHorizontalOffsetValue =
  (reverse: boolean = false) =>
  (index: number, _: number, array: number[]) => {
    const indexArray = range(reverse ? array.length - 1 - index : index);
    const value = indexArray.map(printHorizontalOffsetPart(reverse, array));

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
