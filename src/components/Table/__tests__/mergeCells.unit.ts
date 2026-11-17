import { describe, expect, it } from 'vitest';

import {
  getMergeCellsKey,
  getMergeCellsMap,
  getRowKeyValue,
} from '../mergeCells';
import { TableColumn } from '../types';

type Row = {
  id: number;
  group: string;
  subgroup?: string;
};

const rows: Row[] = [
  { id: 1, group: 'a', subgroup: 'x' },
  { id: 2, group: 'a', subgroup: 'x' },
  { id: 3, group: 'a', subgroup: 'y' },
  { id: 4, group: 'b', subgroup: 'y' },
];

const getMergeColumn = (
  mergeCells: (row: Row) => string | number | undefined,
): TableColumn<Row>[] => [
  { accessor: 'group', mergeCells: ({ row }) => mergeCells(row) },
];

describe('mergeCells helpers', () => {
  describe('getRowKeyValue', () => {
    it('использует getRowKey', () => {
      expect(getRowKeyValue(rows[0], () => 'custom', 0)).toBe('custom');
    });

    it('использует id строки, если getRowKey не задан', () => {
      expect(getRowKeyValue(rows[0], undefined, 10)).toBe(1);
    });

    it('использует индекс строки, если нет ни getRowKey, ни id', () => {
      expect(getRowKeyValue({ group: 'a' }, undefined, 10)).toBe(10);
    });
  });

  describe('getMergeCellsKey', () => {
    it('формирует ключ из ключа строки и индекса колонки', () => {
      expect(getMergeCellsKey('row', 2)).toBe('row-2');
    });
  });

  describe('getMergeCellsMap', () => {
    it('растягивает верхнюю ячейку группы и скрывает остальные', () => {
      const map = getMergeCellsMap(
        rows,
        getMergeColumn((row) => row.group),
      );

      expect(map).toEqual({
        '1-0': 2,
        '2-0': 0,
        '3-0': 0,
      });
    });

    it('не объединяет одинаковые значения в разных группах', () => {
      const map = getMergeCellsMap(
        [
          { id: 1, group: 'a' },
          { id: 2, group: 'b' },
          { id: 3, group: 'a' },
        ],
        getMergeColumn((row) => row.group),
      );

      expect(map).toEqual({});
    });

    it('пропускает ячейки с undefined-признаком', () => {
      const map = getMergeCellsMap(
        rows,
        getMergeColumn((row) =>
          row.id === 1 || row.id === 2 ? row.group : undefined,
        ),
      );

      expect(map).toEqual({
        '1-0': 1,
        '2-0': 0,
      });
    });

    it('считает объединения независимо для каждой колонки', () => {
      const columns: TableColumn<Row>[] = [
        {
          accessor: 'group',
          mergeCells: ({ row }) => row.group,
        },
        {
          accessor: 'subgroup',
          mergeCells: ({ row }) => row.subgroup,
        },
      ];

      const map = getMergeCellsMap(rows, columns);

      expect(map).toEqual({
        '1-0': 2,
        '2-0': 0,
        '3-0': 0,
        '1-1': 1,
        '2-1': 0,
        '3-1': 1,
        '4-1': 0,
      });
    });

    it('использует кастомный getRowKey в ключах карты', () => {
      const map = getMergeCellsMap(
        rows,
        getMergeColumn((row) => row.group),
        (row) => `row-${row.id}`,
      );

      expect(map).toEqual({
        'row-1-0': 2,
        'row-2-0': 0,
        'row-3-0': 0,
      });
    });
  });
});
