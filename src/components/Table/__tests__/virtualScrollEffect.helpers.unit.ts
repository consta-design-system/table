import { describe, expect, it } from 'vitest';

import { TableMergeCells } from '../types';
import {
  calculateBounds,
  calculateSavedSizes,
  getElementHeight,
  getVisiblePosition,
  isMergeCell,
} from '../virtualScrollEffect/helpers';

type Row = { group: string };

const toRows = (groups: string[]): Row[] => groups.map((group) => ({ group }));

const mergeColumns: [number, TableMergeCells<Row>][] = [
  [1, ({ row }) => row.group],
];

const sizes = (count: number, size = 100) => Array(count).fill(size);

describe('getElementHeight', () => {
  it('возвращает высоту элемента', () => {
    const el = document.createElement('div');

    el.style.position = 'fixed';
    el.style.height = '42px';
    document.body.appendChild(el);

    expect(getElementHeight(el)).toBe(42);

    el.remove();
  });

  it('возвращает 0 для отсутствующего элемента', () => {
    expect(getElementHeight(null)).toBe(0);
  });
});

describe('getVisiblePosition', () => {
  it('при прокрутке в начало не уходит в отрицательные координаты', () => {
    // gap = height(400), upGap = 200: start = round(0 - 200) → 0, end = gap
    expect(getVisiblePosition(0, 400, 50)).toEqual([0, 400]);
  });

  it('смещает окно вниз вместе с прокруткой', () => {
    // start = round(1000 - 200) по шагу height/5 = 80 → 800, end = 1000 + 400 + 200
    expect(getVisiblePosition(1000, 400, 50)).toEqual([800, 1600]);
  });

  it('вычитает busy из начала окна', () => {
    expect(getVisiblePosition(1000, 400, 50, 100)).toEqual([700, 1600]);
  });

  it('при начале окна в нуле вычитает busy и из конца', () => {
    expect(getVisiblePosition(0, 400, 50, 100)).toEqual([0, 300]);
  });

  it('не возвращает отрицательное начало при большом busy', () => {
    const [start] = getVisiblePosition(0, 400, 50, 1000);

    expect(start).toBe(0);
  });

  it('при строке выше окна берёт gap из максимальной высоты строки', () => {
    // height(100) < elementMaxSize(200) → gap = 200
    // start = round(500 - (200 + 100)) по шагу 20 → 200, end = 500 + 200 + 200
    expect(getVisiblePosition(500, 100, 200)).toEqual([200, 900]);
  });

  it('растёт вместе с прокруткой', () => {
    const atTop = getVisiblePosition(0, 400, 50);
    const lower = getVisiblePosition(1200, 400, 50);

    expect(lower[0]).toBeGreaterThan(atTop[0]);
    expect(lower[1]).toBeGreaterThan(atTop[1]);
  });
});

describe('calculateSavedSizes', () => {
  it('заполняет пустой список измеренных размеров', () => {
    expect(calculateSavedSizes([], [10, 20])).toEqual([10, 20]);
  });

  it('сохраняет ранее измеренные размеры для ещё не измеренных строк', () => {
    expect(calculateSavedSizes([10, 20, 30], [0, 0, 0])).toEqual([10, 20, 30]);
  });

  it('обновляет только положительные размеры', () => {
    expect(calculateSavedSizes([10, 20], [15, 0])).toEqual([15, 20]);
  });

  it('сохраняет хвост, если новых размеров меньше', () => {
    expect(calculateSavedSizes([10, 20, 30], [15])).toEqual([15, 20, 30]);
  });

  it('не мутирует переданный список', () => {
    const savedSizes = [10, 20];

    calculateSavedSizes(savedSizes, [15, 25]);

    expect(savedSizes).toEqual([10, 20]);
  });
});

describe('isMergeCell', () => {
  const rows = toRows(['a', 'a', 'b']);

  it('true, если признак совпадает хотя бы по одной колонке', () => {
    expect(isMergeCell(mergeColumns, rows, 0, 1)).toBe(true);
  });

  it('false для разных признаков', () => {
    expect(isMergeCell(mergeColumns, rows, 1, 2)).toBe(false);
  });

  it('false без колонок mergeCells', () => {
    expect(isMergeCell([], rows, 0, 1)).toBe(false);
  });

  it('false, если одна из строк вне диапазона', () => {
    expect(isMergeCell(mergeColumns, rows, 0, -1)).toBe(false);
    expect(isMergeCell(mergeColumns, rows, 2, 3)).toBe(false);
  });

  it('совпадение undefined-признаков тоже считается объединением', () => {
    // getMergeCellsMap трактует undefined как «не объединять», а здесь
    // undefined === undefined даёт true
    const sign: TableMergeCells<Row> = ({ row }) =>
      row.group === 'x' ? undefined : row.group;

    expect(isMergeCell([[1, sign]], toRows(['x', 'x']), 0, 1)).toBe(true);
  });

  it('учитывает несколько колонок mergeCells', () => {
    type TwoColumnsRow = { group: string; other: string };
    const rowsByTwoColumns: TwoColumnsRow[] = [
      { group: 'a', other: 'y' },
      { group: 'b', other: 'y' },
    ];
    const columns: [number, TableMergeCells<TwoColumnsRow>][] = [
      [1, ({ row }) => row.group],
      [2, ({ row }) => row.other],
    ];

    expect(isMergeCell(columns, rowsByTwoColumns, 0, 1)).toBe(true);
  });
});

describe('calculateBounds', () => {
  it('берёт срез по накапливаемым размерам без объединений', () => {
    const [, indexs] = calculateBounds(
      sizes(5),
      sizes(5),
      [0, 250],
      5,
      [],
      toRows(['a', 'b', 'c', 'd', 'e']),
    );

    // три строки по 100px покрывают 250px видимой области
    expect(indexs).toEqual([0, 3]);
  });

  it('добавляет одну строку сверху и уменьшает отступ', () => {
    const [pxs, indexs] = calculateBounds(
      sizes(5),
      sizes(5),
      [200, 500],
      5,
      [],
      toRows(['a', 'b', 'c', 'd', 'e']),
    );

    expect(indexs).toEqual([1, 5]);
    expect(pxs[0]).toBe(100);
  });

  it('начало отступа уходит в минус, когда первая строка уже в срезе', () => {
    // `pxs[0] -= savedSizes[indexs[0]]` выполняется и при indexs[0] === 0,
    // поэтому при прокрутке в начало spaceTop = -размер первой строки.
    // В CSS отрицательная высота игнорируется, но численно это off-by-one.
    const [pxs] = calculateBounds(
      sizes(5),
      sizes(5),
      [0, 250],
      5,
      [],
      toRows(['a', 'b', 'c', 'd', 'e']),
    );

    expect(pxs[0]).toBe(-100);
  });

  it('клампит конец среза до длины списка строк', () => {
    const [, indexs] = calculateBounds(
      sizes(5),
      sizes(5),
      [0, 500],
      3,
      [],
      toRows(['a', 'b', 'c']),
    );

    expect(indexs).toEqual([0, 3]);
  });

  it('догоняет срез, когда часть строк ещё не измерена', () => {
    const [, indexs] = calculateBounds(
      sizes(2),
      sizes(10),
      [0, 500],
      10,
      [],
      toRows(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']),
    );

    // измерено 2 строки (200px), средняя высота 100px → ещё 3 строки до 500px
    expect(indexs).toEqual([0, 5]);
  });

  it('включает сверху объединённые строки группы', () => {
    const rows = toRows(['a', 'a', 'a', 'b', 'c', 'd']);
    const [pxs, indexs] = calculateBounds(
      sizes(6),
      sizes(6),
      [300, 500],
      6,
      mergeColumns,
      rows,
    );

    // срез без объединений был бы [2, 5]; строки 0 и 1 объединены со строкой 2,
    // поэтому начало сдвигается до 0, а отступ уменьшается на их размеры
    expect(indexs).toEqual([0, 5]);
    expect(pxs[0]).toBe(0);
  });

  it('добавляет снизу группу, начатую сразу за срезом', () => {
    const rows = toRows(['x', 'x', 'c', 'c', 'd', 'e']);
    const [pxs, indexs] = calculateBounds(
      sizes(6),
      sizes(6),
      [0, 200],
      6,
      mergeColumns,
      rows,
    );

    expect(indexs).toEqual([0, 3]);
    expect(pxs[1]).toBe(300);
  });

  it('не добавляет снизу строку, объединённую с последней строкой среза', () => {
    const rows = toRows(['x', 'a', 'a', 'a', 'b', 'c']);
    const [, indexs] = calculateBounds(
      sizes(6),
      sizes(6),
      [0, 300],
      6,
      mergeColumns,
      rows,
    );

    // срез [0, 3] берёт строки 1 и 2 группы 'a', строка 3 той же группы
    // остаётся снаружи: цикл сравнивает rows[indexs[1]] с rows[indexs[1] + 1],
    // а не с последней строкой среза
    expect(indexs).toEqual([0, 3]);
  });

  it('оставляет срез без изменений при отсутствии объединений', () => {
    const rows = toRows(['a', 'b', 'c', 'd', 'e', 'f']);

    const bounds = calculateBounds(sizes(6), sizes(6), [300, 500], 6, [], rows);

    expect(bounds).toEqual([
      [200, 500],
      [2, 5],
    ]);
  });
});
