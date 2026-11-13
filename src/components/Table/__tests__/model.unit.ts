import { createRoot } from '@consta/uikit/__internal__/src/utils/vitest';
import { atom } from '@reatom/core';
import { describe, expect, it } from 'vitest';

import { getMaxLevel, headerDataModel, transformColumns } from '../model';
import { Position, TableColumn } from '../types';

type WidthKeyColumn = TableColumn<Row> & { key: string };
type PositionedHeader = Position & { width?: string | number };

createRoot();

type Row = { id: number };

const col = (title: string, props: Partial<TableColumn<Row>> = {}) => ({
  title,
  accessor: title.toLowerCase(),
  ...props,
});

describe('getMaxLevel', () => {
  it('возвращает 1 для пустого списка колонок: уровень 1 учитывается всегда', () => {
    expect(getMaxLevel([])).toBe(1);
  });

  it('возвращает 1 для плоской структуры', () => {
    expect(getMaxLevel([col('A'), col('B')])).toBe(1);
  });

  it('возвращает 2 для вложенности один уровень', () => {
    expect(
      getMaxLevel([
        {
          ...col('G'),
          columns: [col('A'), col('B')],
        },
        col('C'),
      ]),
    ).toBe(2);
  });

  it('возвращает 3 для вложенности два уровня', () => {
    expect(
      getMaxLevel([
        {
          ...col('G'),
          columns: [
            {
              ...col('H'),
              columns: [col('A'), col('B')],
            },
            col('C'),
          ],
        },
        col('D'),
      ]),
    ).toBe(3);
  });
});

describe('transformColumns', () => {
  it('плоская структура: один уровень заголовков', () => {
    const columns = [col('A'), col('B'), col('C')];

    const headers = transformColumns(columns, getMaxLevel(columns));

    expect(headers).toHaveLength(1);
    expect(headers[0]).toMatchObject([
      {
        title: 'A',
        colId: 0,
        position: {
          level: 0,
          gridIndex: 0,
          topHeaderGridIndex: 0,
          rowSpan: 1,
          isFirst: true,
          isLastPinnedLeft: false,
        },
      },
      {
        title: 'B',
        colId: 1,
        position: {
          level: 0,
          gridIndex: 1,
          topHeaderGridIndex: 1,
          rowSpan: 1,
          isFirst: false,
          isLastPinnedLeft: false,
        },
      },
      {
        title: 'C',
        colId: 2,
        position: {
          level: 0,
          gridIndex: 2,
          topHeaderGridIndex: 2,
          rowSpan: 1,
          isFirst: false,
          isLastPinnedLeft: false,
        },
      },
    ]);
  });

  it('вложенность 2 уровня: colSpan группы и rowSpan листовых колонок', () => {
    const columns: TableColumn<Row>[] = [
      { ...col('G'), columns: [col('A'), col('B')] },
      col('C'),
    ];

    const headers = transformColumns(columns, getMaxLevel(columns));

    expect(headers).toHaveLength(2);
    expect(headers[0]).toMatchObject([
      {
        title: 'G',
        colId: 0,
        position: {
          level: 0,
          gridIndex: 0,
          topHeaderGridIndex: 0,
          colSpan: 2,
          isFirst: true,
        },
      },
      {
        title: 'C',
        colId: 3,
        position: {
          level: 0,
          gridIndex: 2,
          topHeaderGridIndex: 1,
          rowSpan: 2,
          isFirst: false,
        },
      },
    ]);
    expect(headers[1]).toMatchObject([
      {
        title: 'A',
        colId: 1,
        parentId: 0,
        position: {
          level: 1,
          gridIndex: 0,
          topHeaderGridIndex: 0,
          rowSpan: 1,
          isFirst: true,
        },
      },
      {
        title: 'B',
        colId: 2,
        parentId: 0,
        position: {
          level: 1,
          gridIndex: 1,
          topHeaderGridIndex: 0,
          rowSpan: 1,
          isFirst: false,
        },
      },
    ]);
  });

  it('вложенность 3 уровня: colSpan по числу листьев на каждом уровне', () => {
    const columns: TableColumn<Row>[] = [
      {
        ...col('G'),
        columns: [{ ...col('H'), columns: [col('A'), col('B')] }, col('C')],
      },
      col('D'),
    ];

    const headers = transformColumns(columns, getMaxLevel(columns));

    expect(headers).toHaveLength(3);
    expect(headers[0]).toMatchObject([
      {
        title: 'G',
        colId: 0,
        position: { level: 0, gridIndex: 0, colSpan: 3, isFirst: true },
      },
      {
        title: 'D',
        colId: 5,
        position: { level: 0, gridIndex: 3, rowSpan: 3 },
      },
    ]);
    expect(headers[1]).toMatchObject([
      {
        title: 'H',
        colId: 1,
        parentId: 0,
        position: { level: 1, gridIndex: 0, colSpan: 2 },
      },
      {
        title: 'C',
        colId: 2,
        parentId: 0,
        position: { level: 1, gridIndex: 2, rowSpan: 2 },
      },
    ]);
    expect(headers[2]).toMatchObject([
      {
        title: 'A',
        colId: 3,
        parentId: 1,
        position: { level: 2, gridIndex: 0, rowSpan: 1, isFirst: true },
      },
      {
        title: 'B',
        colId: 4,
        parentId: 1,
        position: { level: 2, gridIndex: 1, rowSpan: 1, isFirst: false },
      },
    ]);
  });

  describe('isLastPinnedLeft', () => {
    it('отмечает последнюю колонку группы pinned: left', () => {
      const columns: TableColumn<Row>[] = [
        col('A', { pinned: 'left' }),
        col('B', { pinned: 'left' }),
        col('C'),
      ];

      const headers = transformColumns(columns, getMaxLevel(columns));

      expect(headers[0]).toMatchObject([
        { title: 'A', position: { isLastPinnedLeft: false } },
        { title: 'B', position: { isLastPinnedLeft: true } },
        { title: 'C', position: { isLastPinnedLeft: false } },
      ]);
    });

    it('не отмечает единственную колонку, если справа ничего нет', () => {
      const columns: TableColumn<Row>[] = [col('A', { pinned: 'left' })];

      const headers = transformColumns(columns, getMaxLevel(columns));

      expect(headers[0][0].position.isLastPinnedLeft).toBeFalsy();
    });

    it('не отмечает pinned-колонку, если следующая тоже pinned: left', () => {
      const columns: TableColumn<Row>[] = [
        col('A', { pinned: 'left' }),
        col('B', { pinned: 'left' }),
      ];

      const headers = transformColumns(columns, getMaxLevel(columns));

      expect(headers[0][0].position.isLastPinnedLeft).toBe(false);
      expect(headers[0][1].position.isLastPinnedLeft).toBeFalsy();
    });

    it('передаёт признак последней pinned-группы дочерним колонкам', () => {
      const columns: TableColumn<Row>[] = [
        { ...col('G', { pinned: 'left' }), columns: [col('A'), col('B')] },
        col('C'),
      ];

      const headers = transformColumns(columns, getMaxLevel(columns));

      expect(headers[0][0].position.isLastPinnedLeft).toBe(true);
      expect(headers[1]).toMatchObject([
        { title: 'A', position: { isLastPinnedLeft: false } },
        { title: 'B', position: { isLastPinnedLeft: true } },
      ]);
    });

    it('не передаёт признак, если следующая группа тоже pinned: left', () => {
      const columns: TableColumn<Row>[] = [
        { ...col('G', { pinned: 'left' }), columns: [col('A'), col('B')] },
        { ...col('H', { pinned: 'left' }), columns: [col('C'), col('D')] },
      ];

      const headers = transformColumns(columns, getMaxLevel(columns));

      expect(headers[0][0].position.isLastPinnedLeft).toBe(false);
      expect(headers[1].map((item) => item.position.isLastPinnedLeft)).toEqual([
        false,
        false,
        undefined,
        undefined,
      ]);
    });
  });
});

describe('headerDataModel', () => {
  const createModel = (
    columns: TableColumn<Row>[],
    virtualScroll: boolean | [boolean, boolean] | undefined = false,
  ) => {
    const columnsAtom = atom<TableColumn<Row>[]>(columns);
    const virtualScrollAtom = atom<boolean | [boolean, boolean] | undefined>(
      virtualScroll,
    );

    return {
      ...headerDataModel(columnsAtom, virtualScrollAtom),
      columnsAtom,
      virtualScrollAtom,
    };
  };

  describe('lowHeadersAtom (transformPinnedColumns)', () => {
    it('перемещает pinned-колонки: left в начало, right в конец', () => {
      const model = createModel([
        col('A'),
        col('B', { pinned: 'left' }),
        col('C'),
        col('D', { pinned: 'right' }),
      ]);

      expect(model.lowHeadersAtom().map((item) => item.title)).toEqual([
        'B',
        'A',
        'C',
        'D',
      ]);
      expect(model.lowHeadersAtom().map((item) => item.pinned)).toEqual([
        'left',
        undefined,
        undefined,
        'right',
      ]);
    });

    it('переносит всю группу, если лист внутри неё pinned: left', () => {
      const model = createModel([
        {
          ...col('G'),
          columns: [col('A', { pinned: 'left' }), col('B', { pinned: 'left' })],
        },
        col('C'),
      ]);

      // lowHeaders содержит только листовые колонки
      expect(model.lowHeadersAtom().map((item) => item.title)).toEqual([
        'A',
        'B',
        'C',
      ]);
      expect(
        (model.lowHeadersAtom() as WidthKeyColumn[]).map((item) => item.key),
      ).toEqual(['0-0', '0-1', '1']);
    });

    it('не переносит группу, если pinned отмечена только сама группа, а не листы', () => {
      const model = createModel([
        col('A'),
        { ...col('G', { pinned: 'left' }), columns: [col('B'), col('C')] },
      ]);

      // pinned-статус групп определяется только по листовым колонкам
      expect(
        model.headersAtom().map((level) => level.map((i) => i.title)),
      ).toEqual([
        ['A', 'G'],
        ['B', 'C'],
      ]);
    });

    it('пересчитывается при изменении колонок', () => {
      const model = createModel([col('A'), col('B')]);

      expect(model.lowHeadersAtom().map((item) => item.title)).toEqual([
        'A',
        'B',
      ]);

      model.columnsAtom.set([col('A', { pinned: 'left' }), col('B')]);

      expect(model.lowHeadersAtom().map((item) => item.title)).toEqual([
        'A',
        'B',
      ]);
      expect(model.lowHeadersAtom()[0].pinned).toBe('left');
    });
  });

  describe('headersAtom', () => {
    it('строит уровни заголовков с учётом перестановки pinned', () => {
      const model = createModel([
        col('A'),
        {
          ...col('G'),
          columns: [col('B', { pinned: 'left' }), col('C', { pinned: 'left' })],
        },
      ]);

      const headers = model.headersAtom();

      expect(headers.map((level) => level.map((item) => item.title))).toEqual([
        ['G', 'A'],
        ['B', 'C'],
      ]);
    });
  });

  describe('flattenedHeadersAtom', () => {
    it('выравнивает заголовки и подставляет width', () => {
      const model = createModel([
        { ...col('G'), columns: [col('A'), col('B', { width: 100 })] },
      ]);

      const flattened = model.flattenedHeadersAtom();

      expect(flattened.map((item) => item.title)).toEqual(['G', 'A', 'B']);
      expect(
        flattened.map(
          (item) =>
            (item.position as PositionedHeader).width as string | number,
        ),
      ).toEqual(['auto', 'auto', 100]);
    });
  });

  describe('stickyLeftOffsetsAtom / stickyRightOffsetsAtom', () => {
    it('считает смещения по листовым ячейкам группы', () => {
      const model = createModel([
        { ...col('G'), columns: [col('A'), col('B')] },
        col('C'),
      ]);

      // headers.flat() идёт по уровням: сначала [G, C], затем [A, B]
      // низовые колонки: A (индекс 0), B (индекс 1), C (индекс 2)
      expect(model.stickyLeftOffsetsAtom()).toEqual([0, 2, 0, 1]);
      expect(model.stickyRightOffsetsAtom()).toEqual([1, 2, 0, 1]);
    });

    it('для плоской структуры совпадают с индексами колонок', () => {
      const model = createModel([col('A'), col('B'), col('C')]);

      expect(model.stickyLeftOffsetsAtom()).toEqual([0, 1, 2]);
      expect(model.stickyRightOffsetsAtom()).toEqual([0, 1, 2]);
    });
  });

  describe('bordersFlattenedHeadersAtom', () => {
    it('не ставит левую границу у первой колонки и после последней pinned', () => {
      const model = createModel([col('A', { pinned: 'left' }), col('B')]);

      // [левая граница, последняя pinned слева, вложенный уровень]
      expect(model.bordersFlattenedHeadersAtom()).toEqual([
        [false, true, false],
        [false, false, false],
      ]);
    });

    it('ставит границы между колонками и группам с вложенностью', () => {
      const model = createModel([
        { ...col('G'), columns: [col('A'), col('B')] },
        col('C'),
      ]);

      // headers.flat() идёт по уровням: [G, C, A, B]
      // [левая граница, последняя pinned слева, вложенный уровень]
      expect(model.bordersFlattenedHeadersAtom()).toEqual([
        [false, false, false],
        [true, false, false],
        [false, false, true],
        [true, false, true],
      ]);
    });
  });

  describe('leftNoVisibleItemsAtom / rightNoVisibleItemsAtom', () => {
    const fourColumns: TableColumn<Row>[] = [
      col('A'),
      col('B'),
      col('C'),
      col('D'),
    ];

    it('возвращает 0 без горизонтального virtualScroll', () => {
      const model = createModel(fourColumns, false);
      model.intersectingColumnsAtom.set([false, false, true, true]);

      expect(model.leftNoVisibleItemsAtom()).toBe(0);
      expect(model.rightNoVisibleItemsAtom()).toBe(0);
    });

    it('возвращает количество всех колонок, если пересечения не определены', () => {
      const model = createModel(fourColumns, [true, false]);
      model.intersectingColumnsAtom.set([]);

      expect(model.leftNoVisibleItemsAtom()).toBe(4);
      expect(model.rightNoVisibleItemsAtom()).toBe(0);
    });

    it('считает невидимые колонки слева и справа', () => {
      const model = createModel(fourColumns, [true, false]);

      model.intersectingColumnsAtom.set([false, false, true, true]);
      expect(model.leftNoVisibleItemsAtom()).toBe(2);
      expect(model.rightNoVisibleItemsAtom()).toBe(0);

      model.intersectingColumnsAtom.set([true, false, false, true]);
      expect(model.leftNoVisibleItemsAtom()).toBe(0);
      expect(model.rightNoVisibleItemsAtom()).toBe(0);

      model.intersectingColumnsAtom.set([true, false, false]);
      expect(model.leftNoVisibleItemsAtom()).toBe(0);
      expect(model.rightNoVisibleItemsAtom()).toBe(2);
    });
  });
});
