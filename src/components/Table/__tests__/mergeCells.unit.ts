import { describe, expect, it } from 'vitest';

import {
  getMergeCellsKey,
  getMergeCellsMap,
  getRowKeyValue,
} from '../mergeCells';
import { TableMergeCells } from '../types';

const stringSign: TableMergeCells<string> = ({ row }) => row;

const toColumns = <ROW>(
  index: number,
  mergeCells: TableMergeCells<ROW>,
): [[number, TableMergeCells<ROW>]] => [[index, mergeCells]];

describe('getRowKeyValue', () => {
  it('использует значение кастомного getRowKey', () => {
    expect(getRowKeyValue({ id: 'row-1' }, (row) => row.id, 7)).toBe('row-1');
  });

  it('берёт индекс строки, если getRowKey возвращает undefined', () => {
    expect(getRowKeyValue({ id: 'row-1' }, () => undefined, 7)).toBe(7);
  });

  it('берёт индекс строки без getRowKey, поле id не используется', () => {
    expect(getRowKeyValue({ id: 1 }, undefined, 2)).toBe(2);
  });
});

describe('getMergeCellsKey', () => {
  it('собирает ключ из ключа строки и индекса колонки', () => {
    expect(getMergeCellsKey('row-1', 3)).toBe('row-1-3');
    expect(getMergeCellsKey(0, 1)).toBe('0-1');
  });
});

describe('getMergeCellsMap', () => {
  it('возвращает пустую карту, если колонок с mergeCells нет', () => {
    expect(getMergeCellsMap(['a', 'a'], [0, 2], [])).toEqual({});
  });

  it('возвращает пустую карту для пустого среза', () => {
    expect(
      getMergeCellsMap(['a', 'a'], [0, 0], toColumns(1, stringSign)),
    ).toEqual({});
  });

  it('растягивает верхнюю строку группы и отмечает перекрытые нулём', () => {
    expect(
      getMergeCellsMap(['a', 'a', 'b'], [0, 3], toColumns(1, stringSign)),
    ).toEqual({
      '0-1': 1,
      '1-1': 0,
    });
  });

  it('не создаёт ключей для одиночных строк', () => {
    expect(
      getMergeCellsMap(['a', 'b', 'c'], [0, 3], toColumns(1, stringSign)),
    ).toEqual({});
  });

  it('не объединяет одинаковые метки в разрыве группы', () => {
    expect(
      getMergeCellsMap(['a', 'b', 'a'], [0, 3], toColumns(1, stringSign)),
    ).toEqual({});
  });

  it('считает длину группы по абсолютным индексам строк среза', () => {
    expect(
      getMergeCellsMap(['a', 'a', 'a'], [1, 3], toColumns(1, stringSign)),
    ).toEqual({
      '1-1': 1,
      '2-1': 0,
    });
  });

  it('ограничивает длину группы правым краем среза', () => {
    expect(
      getMergeCellsMap(['a', 'a', 'a'], [0, 2], toColumns(1, stringSign)),
    ).toEqual({
      '0-1': 1,
      '1-1': 0,
    });
  });

  it('несколько групп в срезе дают независимые ключи', () => {
    expect(
      getMergeCellsMap(
        ['a', 'a', 'b', 'c', 'c', 'c'],
        [0, 6],
        toColumns(1, stringSign),
      ),
    ).toEqual({
      '0-1': 1,
      '1-1': 0,
      '3-1': 2,
      '4-1': 0,
      '5-1': 0,
    });
  });

  it('пропускает строки с undefined-признаком', () => {
    const sign: TableMergeCells<string> = ({ row }) =>
      row === 'b' ? undefined : row;

    expect(
      getMergeCellsMap(['a', 'a', 'b', 'b'], [0, 4], toColumns(1, sign)),
    ).toEqual({
      '0-1': 1,
      '1-1': 0,
    });
  });

  it('числовой признак объединяет строки так же, как строковый', () => {
    const sign: TableMergeCells<number> = ({ row }) => row;

    expect(getMergeCellsMap([5, 5, 7], [0, 3], [[1, sign]])).toEqual({
      '0-1': 1,
      '1-1': 0,
    });
  });

  it('индекс колонки берётся из lowHeaders (с сервисной колонкой — от 1)', () => {
    expect(
      getMergeCellsMap(['a', 'a'], [0, 2], toColumns(2, stringSign)),
    ).toEqual({
      '0-2': 1,
      '1-2': 0,
    });
  });

  it('несколько колонок с mergeCells дают ключи по индексу каждой колонки', () => {
    type Row = { a: number; b: number };
    const rows: Row[] = [
      { a: 1, b: 1 },
      { a: 1, b: 2 },
    ];

    expect(
      getMergeCellsMap(
        rows,
        [0, 2],
        [
          [1, ({ row }) => row.a],
          [2, ({ row }) => row.b],
        ],
      ),
    ).toEqual({
      '0-1': 1,
      '1-1': 0,
    });
  });

  it('ключи строк берутся из getRowKey', () => {
    type Row = { id: string; group: string };
    const rows: Row[] = [
      { id: 'x', group: 'a' },
      { id: 'y', group: 'a' },
    ];

    expect(
      getMergeCellsMap(
        rows,
        [0, 2],
        toColumns(1, ({ row }) => row.group),
        (row) => row.id,
      ),
    ).toEqual({
      'x-1': 1,
      'y-1': 0,
    });
  });

  it('перезаписывает span нулём при неуникальных ключах getRowKey', () => {
    type Row = { id: string; group: string };
    const rows: Row[] = [
      { id: 'x', group: 'a' },
      { id: 'x', group: 'a' },
    ];

    // одна и та же строка ключа для обеих строк группы: значение span
    // затирается значением 0, поэтому getRowKey должен быть уникальным
    expect(
      getMergeCellsMap(
        rows,
        [0, 2],
        toColumns(1, ({ row }) => row.group),
        (row) => row.id,
      ),
    ).toEqual({ 'x-1': 0 });
  });

  it('группа длиннее среза не создаёт ключей за его пределами', () => {
    const rows = ['a', 'a', 'a', 'a'];

    const map = getMergeCellsMap(rows, [0, 2], toColumns(1, stringSign));

    expect(map).toEqual({ '0-1': 1, '1-1': 0 });
    expect(Object.keys(map)).toHaveLength(2);
  });
});
