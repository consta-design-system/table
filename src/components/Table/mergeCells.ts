import { isNotNil } from '##/utils/type-guards';

import { TableMergeCells, TableMergeCellsMap } from './types';

export const getRowKeyValue = <ROW>(
  row: ROW,
  getRowKey: ((row: ROW) => string | number | undefined) | undefined,
  rowIndex: number,
): string | number => {
  const key = getRowKey?.(row);

  if (isNotNil(key)) {
    return key;
  }

  return rowIndex;
};

export const getMergeCellsKey = (
  rowKey: string | number,
  columnIndex: number,
) => `${rowKey}-${columnIndex}`;

/**
 * Считает карту объединений ячеек по вертикали.
 *
 * Ключ — `${rowKey}-${columnIndex}`, значение:
 * - положительное число — на сколько ячеек вниз нужно растянуть ячейку;
 * - `0` — ячейку рисовать не нужно, она перекрыта верхней;
 * - отсутствие ключа — ячейка рисуется как обычно.
 */

export const getMergeCellsMap = <ROW>(
  rows: ROW[],
  slice: [number, number],
  columnsMergeCells: [number, TableMergeCells<ROW>][],
  getRowKey?: (row: ROW) => string | number | undefined,
): TableMergeCellsMap => {
  const mergeCellsMap: TableMergeCellsMap = {};

  columnsMergeCells.forEach(([index, mergeCells]) => {
    if (!mergeCells) {
      return;
    }

    let groupStart = slice[0];

    while (groupStart < slice[1]) {
      const groupValue = mergeCells({ row: rows[groupStart] });

      if (groupValue === undefined) {
        groupStart++;
        continue;
      }

      let groupEnd = groupStart + 1;

      while (
        groupEnd < slice[1] &&
        // rows[groupEnd] &&
        mergeCells({ row: rows[groupEnd] }) === groupValue
      ) {
        groupEnd++;
      }

      const groupLength = groupEnd - groupStart;

      if (groupLength > 1) {
        const firstRowKey = getRowKeyValue(
          rows[groupStart],
          getRowKey,
          groupStart,
        );

        mergeCellsMap[getMergeCellsKey(firstRowKey, index)] = groupLength - 1;

        for (let rowIndex = groupStart + 1; rowIndex < groupEnd; rowIndex++) {
          const rowKey = getRowKeyValue(rows[rowIndex], getRowKey, rowIndex);

          mergeCellsMap[getMergeCellsKey(rowKey, index)] = 0;
        }
      }

      groupStart = groupEnd;
    }
  });

  return mergeCellsMap;
};
