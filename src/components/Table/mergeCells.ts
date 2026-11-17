import { TableColumn, TableMergeCellsMap } from './types';

export const getRowKeyValue = <ROW>(
  row: ROW,
  getRowKey: ((row: ROW) => string | number | undefined) | undefined,
  rowIndex: number,
): string | number => {
  const key = getRowKey?.(row);

  if (key !== undefined && key !== null) {
    return key;
  }

  if (row && typeof row === 'object' && 'id' in row) {
    const { id } = row as { id?: unknown };

    if (typeof id === 'string' || typeof id === 'number') {
      return id;
    }
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

// TODO: не верно считае rowKey, мы закидываем слайс а индекс слайса не учитывается
export const getMergeCellsMap = <ROW>(
  rows: ROW[],
  columns: TableColumn<ROW>[],
  getRowKey?: (row: ROW) => string | number | undefined,
): TableMergeCellsMap => {
  const mergeCellsMap: TableMergeCellsMap = {};

  columns.forEach((column, columnIndex) => {
    const { mergeCells } = column;

    if (!mergeCells) {
      return;
    }

    let groupStart = 0;

    while (groupStart < rows.length) {
      const groupValue = mergeCells({ row: rows[groupStart] });

      if (groupValue === undefined) {
        groupStart++;
        continue;
      }

      let groupEnd = groupStart + 1;

      while (
        groupEnd < rows.length &&
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

        mergeCellsMap[getMergeCellsKey(firstRowKey, columnIndex)] =
          groupLength - 1;

        for (let rowIndex = groupStart + 1; rowIndex < groupEnd; rowIndex++) {
          const rowKey = getRowKeyValue(rows[rowIndex], getRowKey, rowIndex);

          mergeCellsMap[getMergeCellsKey(rowKey, columnIndex)] = 0;
        }
      }

      groupStart = groupEnd;
    }
  });

  return mergeCellsMap;
};
