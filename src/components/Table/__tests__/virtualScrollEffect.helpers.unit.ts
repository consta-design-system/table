import { describe, expect, it } from 'vitest';

import { calculateBounds, isMergeCell } from '../virtualScrollEffect/helpers';

type Row = {
  group: string;
};

const rows: Row[] = [
  { group: 'a' },
  { group: 'a' },
  { group: 'a' },
  { group: 'a' },
  { group: 'a' },
  { group: 'b' },
  { group: 'b' },
  { group: 'b' },
  { group: 'b' },
  { group: 'b' },
];

const mergeCells = [(props: { row: Row }) => props.row.group];
const sizes = Array(rows.length).fill(50);

describe('virtualScrollEffect helpers и mergeCells', () => {
  describe('isMergeCell', () => {
    it('возвращает true для одинаковых определённых признаков', () => {
      expect(isMergeCell(mergeCells, rows, 0, 1)).toBe(true);
    });

    it('возвращает false для разных признаков', () => {
      expect(isMergeCell(mergeCells, rows, 4, 5)).toBe(false);
    });

    it('возвращает false, если признаки undefined', () => {
      expect(isMergeCell([() => undefined], rows, 0, 1)).toBe(false);
    });

    it('возвращает false для несуществующих строк', () => {
      expect(isMergeCell(mergeCells, rows, -1, 0)).toBe(false);
      expect(isMergeCell(mergeCells, rows, rows.length - 1, rows.length)).toBe(
        false,
      );
    });
  });

  describe('calculateBounds', () => {
    it('включает последнюю строку группы на нижней границе', () => {
      const bounds = calculateBounds(
        sizes,
        sizes,
        [0, 200],
        rows.length,
        mergeCells,
        rows,
      );

      expect(bounds[1]).toEqual([0, 5]);
    });

    it('поднимает верхнюю границу до начала группы', () => {
      const bounds = calculateBounds(
        sizes,
        sizes,
        [200, 400],
        rows.length,
        mergeCells,
        rows,
      );

      expect(bounds[1][0]).toBe(0);
    });

    it('не расширяет границы, если объединений нет', () => {
      const bounds = calculateBounds(
        sizes,
        sizes,
        [0, 200],
        rows.length,
        [() => undefined],
        rows,
      );

      expect(bounds[1]).toEqual([0, 4]);
    });
  });
});
