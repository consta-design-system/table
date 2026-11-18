import { Atom, Computed } from '@reatom/core';

import { TableMergeCells } from '../types';

export type VirtualScrollReturn<ITEM_ELEMENT, SCROLL_ELEMENT> = [
  listElementsAtom: Computed<
    Atom<ITEM_ELEMENT | null, [newState: ITEM_ELEMENT | null]>[]
  >,
  scrollElementAtom: Atom<
    SCROLL_ELEMENT | null,
    [newState: SCROLL_ELEMENT | null]
  >,
  sliceAtom: Computed<[number, number]>,
  spaceTopAtom: Computed<number>,
];

export type Bounds = [[number, number], [number, number]];

export const defaultItemsCalculationCount = 1;

export const getElementHeight = (el: HTMLElement | SVGGraphicsElement | null) =>
  el?.getBoundingClientRect().height || 0;

const roundPositionByGap = (position: number, gap: number) => {
  if (position <= 0) {
    return 0;
  }
  return Math.ceil(position / gap) * gap;
};

export const getVisiblePosition = (
  top: number,
  height: number,
  elementMaxSize: number,
  busy: number = 0,
): [number, number] => {
  const gap =
    height > elementMaxSize * defaultItemsCalculationCount
      ? height
      : elementMaxSize * defaultItemsCalculationCount;

  const visiblePosition: [number, number] = [
    Math.ceil(
      roundPositionByGap(
        height < gap ? top - (gap + height) : top - (gap + height / 2),
        height,
      ),
    ),
    Math.ceil(roundPositionByGap(top === 0 ? gap : top + gap * 1.1, height)),
  ];

  const visiblePositionStart = Math.max(visiblePosition[0] - busy, 0);
  const visiblePositionEnd =
    visiblePositionStart === 0 ? visiblePosition[1] - busy : visiblePosition[1];

  return [visiblePositionStart, visiblePositionEnd];
};

export const calculateSavedSizes = (savedSizes: number[], sizes: number[]) => {
  const newSavedSizes = [...savedSizes];
  for (let index = 0; index < sizes.length; index++) {
    const element = sizes[index];

    if (element > 0) {
      newSavedSizes[index] = element;
    }
  }
  return newSavedSizes;
};

const addCount = (
  pxs: [number, number],
  visiblePosition: [number, number],
  savedSize: number[],
) => {
  const lastSavedSize = savedSize.slice(-50);
  const average =
    lastSavedSize.reduce((a, b) => a + b, 0) / lastSavedSize.length;

  let add = 0;

  if (visiblePosition[1] < pxs[1] + add * average) {
    console.log('add 1', add);
    return add;
  }

  while (visiblePosition[1] > pxs[1] + add * average) {
    add += defaultItemsCalculationCount;
    console.log('add 2', add);
  }

  return add;
};

export const isMergeCell = <ROW>(
  mergeCells: [number, TableMergeCells<ROW>][],
  rows: ROW[],
  indexA: number,
  indexB: number,
) => {
  if (!rows[indexA] || !rows[indexB]) {
    return false;
  }
  return mergeCells.some(
    (arg) => arg[1]({ row: rows[indexA] }) === arg[1]({ row: rows[indexB] }),
  );
};

export const calculateBounds = <ROW>(
  savedSizes: number[],
  sizes: number[],
  visiblePosition: [number, number],
  length: number,
  mergeCells: [number, TableMergeCells<ROW>][],
  rows: ROW[],
): Bounds => {
  const pxs: [number, number] = [0, 0];
  const indexs: [number, number] = [0, 0];

  for (let index = 0; index < savedSizes.length; index++) {
    if (visiblePosition[0] > pxs[0]) {
      pxs[0] += savedSizes[index];
      indexs[0] = index + 1;
    }

    if (visiblePosition[1] > pxs[1]) {
      pxs[1] += savedSizes[index];
      indexs[1] = index + 1;
    }
  }

  if (indexs[0] === 0 && indexs[1] === 0) {
    indexs[1] = defaultItemsCalculationCount;
  }

  if (sizes.length !== savedSizes.length) {
    indexs[1] += addCount(pxs, visiblePosition, savedSizes);
  }

  console.log('indexs 1', indexs);

  if (indexs[1] > length) {
    indexs[1] = length;
  }

  console.log('indexs 2', indexs);

  // Добавляем объединенные строки  строки сверху

  let upperIndex = indexs[0];

  while (isMergeCell(mergeCells, rows, upperIndex, upperIndex - 1)) {
    indexs[0] -= 1;
    pxs[0] -= savedSizes[upperIndex - 1];
    upperIndex--;
  }

  let lowerIndex = indexs[1];

  // Добавляем объединенные строки  строки снизу

  while (isMergeCell(mergeCells, rows, lowerIndex, lowerIndex + 1)) {
    indexs[1] += 1;
    pxs[1] += savedSizes[lowerIndex + 1] || 0;
    lowerIndex++;
  }

  return [pxs, indexs];
};
