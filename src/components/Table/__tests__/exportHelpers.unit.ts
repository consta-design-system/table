import { describe, expect, it, vi } from 'vitest';

import { getMergeRowsIndexs } from '../exportHelpers';

type Row = { athlete: string };

const toRows = (signs: string[]): Row[] =>
  signs.map((athlete) => ({ athlete }));

const sign = (row: Row) => row.athlete;

describe('getMergeRowsIndexs', () => {
  it('возвращает только индекс строки, если соседи не объединены', () => {
    expect(getMergeRowsIndexs(1, toRows(['a', 'b', 'c']), sign)).toEqual([1]);
  });

  it('добавляет строки группы ниже', () => {
    expect(getMergeRowsIndexs(0, toRows(['a', 'a', 'b']), sign)).toEqual([
      0, 1,
    ]);
  });

  it('добавляет строки группы выше', () => {
    expect(getMergeRowsIndexs(1, toRows(['a', 'a', 'b']), sign)).toEqual([
      0, 1,
    ]);
  });

  it('собирает всю группу для строки в середине', () => {
    expect(getMergeRowsIndexs(1, toRows(['a', 'a', 'a', 'b']), sign)).toEqual([
      0, 1, 2,
    ]);
  });

  it('останавливается на границе группы с обеих сторон', () => {
    expect(
      getMergeRowsIndexs(2, toRows(['a', 'a', 'b', 'b', 'c']), sign),
    ).toEqual([2, 3]);
  });

  it('возвращает индексы по возрастанию для любого индекса группы', () => {
    const rows = toRows(['a', 'a', 'a']);

    expect(
      rows.map((_row, index) => getMergeRowsIndexs(index, rows, sign)),
    ).toEqual([
      [0, 1, 2],
      [0, 1, 2],
      [0, 1, 2],
    ]);
  });

  it('не объединяет одинаковые метки в разных группах', () => {
    const rows = toRows(['a', 'b', 'a']);

    expect(getMergeRowsIndexs(0, rows, sign)).toEqual([0]);
    expect(getMergeRowsIndexs(2, rows, sign)).toEqual([2]);
  });

  it('объединяет все строки при одинаковой метке во всём списке', () => {
    expect(getMergeRowsIndexs(2, toRows(['a', 'a', 'a', 'a']), sign)).toEqual([
      0, 1, 2, 3,
    ]);
  });

  it('учитывает составной признак объединения', () => {
    const rows = [
      { athlete: 'Антон', country: 'RU' },
      { athlete: 'Антон', country: 'RU' },
      { athlete: 'Антон', country: 'FR' },
    ];
    const compositeSign = (row: (typeof rows)[number]) =>
      `${row.athlete}-${row.country}`;

    expect(getMergeRowsIndexs(0, rows, compositeSign)).toEqual([0, 1]);
    expect(getMergeRowsIndexs(2, rows, compositeSign)).toEqual([2]);
  });

  it('считает метку по значению, а не по истинности: пустая метка объединяет', () => {
    expect(getMergeRowsIndexs(0, toRows(['', '']), sign)).toEqual([0, 1]);
  });

  it('возвращает [index] для пустого списка строк', () => {
    expect(getMergeRowsIndexs(0, [], sign)).toEqual([0]);
  });

  it('возвращает [index] для индекса вне диапазона', () => {
    expect(getMergeRowsIndexs(5, toRows(['a', 'a']), sign)).toEqual([5]);
  });

  it('не выходит за границы списка при вычислении метки', () => {
    const signSpy = vi.fn(sign);

    getMergeRowsIndexs(1, toRows(['a', 'a', 'b']), signSpy);

    expect(signSpy.mock.calls.length).toBeGreaterThan(0);
    expect(signSpy.mock.calls.every(([row]) => row !== undefined)).toBe(true);
  });

  it('не мутирует переданный список строк', () => {
    const rows = toRows(['a', 'a', 'b']);

    getMergeRowsIndexs(0, rows, sign);

    expect(rows).toEqual(toRows(['a', 'a', 'b']));
  });

  it('фолси-строка считается отсутствующей и не объединяется', () => {
    // строки проверяются через `!rows[index]`, поэтому `0` попадает в ту же
    // ветку, что и отсутствующая строка
    expect(getMergeRowsIndexs(0, [0, 0], (row: number) => `${row}`)).toEqual([
      0,
    ]);
  });
});
