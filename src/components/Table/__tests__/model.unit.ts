import { describe, expect, it } from 'vitest';

import { getMaxLevel, transformColumns } from '../model';
import { TableColumn } from '../types';

type Row = { name: string };

const column = (
  title: string,
  extra?: Partial<TableColumn<Row>>,
): TableColumn<Row> => ({
  title,
  accessor: title,
  ...extra,
});

describe('getMaxLevel', () => {
  it('возвращает 1 для пустого списка колонок', () => {
    // счётчик уровней поднимается до 1 до обхода колонок, поэтому пустой
    // список даёт один уровень, а не 0
    expect(getMaxLevel([])).toBe(1);
  });

  it('возвращает 1 для плоских колонок', () => {
    expect(getMaxLevel([column('Имя'), column('Статус')])).toBe(1);
  });

  it('возвращает 2 для одной группы', () => {
    expect(
      getMaxLevel([
        column('Работник', {
          columns: [column('Имя'), column('Профессия')],
        }),
        column('Статус'),
      ]),
    ).toBe(2);
  });

  it('возвращает глубину самой вложенной ветки', () => {
    expect(
      getMaxLevel([
        column('Имя'),
        column('Медали', {
          columns: [
            column('Команда', {
              columns: [column('Золото')],
            }),
          ],
        }),
      ]),
    ).toBe(3);
  });
});

describe('transformColumns', () => {
  it('для плоских колонок возвращает один ряд шапки', () => {
    const headers = transformColumns([column('Имя'), column('Статус')], 1);

    expect(headers).toHaveLength(1);
    expect(headers[0].map((item) => item.title)).toEqual(['Имя', 'Статус']);
  });

  it('присваивает gridColumn-позиции по порядку', () => {
    const headers = transformColumns([column('Имя'), column('Статус')], 1);

    expect(headers[0][0].position).toMatchObject({
      gridIndex: 0,
      level: 0,
      isFirst: true,
      rowSpan: 1,
    });
    expect(headers[0][1].position).toMatchObject({
      gridIndex: 1,
      level: 0,
      isFirst: false,
      rowSpan: 1,
    });
  });

  it('нумерует colId по всем колонкам подряд', () => {
    const headers = transformColumns([column('Имя'), column('Статус')], 1);

    expect(headers[0][0].colId).toBe(0);
    expect(headers[0][1].colId).toBe(1);
  });

  it('группа занимает столько колонок, сколько у неё листьев', () => {
    const headers = transformColumns(
      [
        column('Работник', {
          columns: [column('Имя'), column('Профессия')],
        }),
        column('Статус'),
      ],
      2,
    );

    expect(headers[0][0].position).toMatchObject({
      gridIndex: 0,
      level: 0,
      colSpan: 2,
    });
    // лист на уровне 0 растягивается на все строки шапки
    expect(headers[0][1].position).toMatchObject({
      gridIndex: 2,
      level: 0,
      rowSpan: 2,
    });
  });

  it('вложенные колонки попадают в следующий ряд шапки', () => {
    const headers = transformColumns(
      [
        column('Работник', {
          columns: [column('Имя'), column('Профессия')],
        }),
        column('Статус'),
      ],
      2,
    );

    expect(headers[1]).toHaveLength(2);
    expect(headers[1].map((item) => item.title)).toEqual(['Имя', 'Профессия']);
    expect(headers[1][0].position).toMatchObject({
      gridIndex: 0,
      level: 1,
      isFirst: true,
      rowSpan: 1,
    });
    expect(headers[1][1].position).toMatchObject({
      gridIndex: 1,
      level: 1,
      isFirst: false,
      rowSpan: 1,
    });
  });

  it('вложенные колонки сохраняют colId и parentId', () => {
    const headers = transformColumns(
      [
        column('Работник', {
          columns: [column('Имя'), column('Профессия')],
        }),
        column('Статус'),
      ],
      2,
    );

    expect(headers[0][0].colId).toBe(0);
    expect(headers[1][0]).toMatchObject({ colId: 1, parentId: 0 });
    expect(headers[1][1]).toMatchObject({ colId: 2, parentId: 0 });
    expect(headers[0][1].colId).toBe(3);
  });

  it('помечает последнюю закрепленную слева колонку на уровне 0', () => {
    const headers = transformColumns(
      [column('Имя', { pinned: 'left' }), column('Статус')],
      1,
    );

    expect(headers[0][0].position.isLastPinnedLeft).toBe(true);
    expect(headers[0][1].position.isLastPinnedLeft).toBeFalsy();
  });

  it('дочерние колонки закрепленной группы наследуют isLastPinnedLeft', () => {
    const headers = transformColumns(
      [
        column('Работник', {
          pinned: 'left',
          columns: [column('Имя'), column('Профессия')],
        }),
        column('Статус'),
      ],
      2,
    );

    expect(headers[0][0].position.isLastPinnedLeft).toBe(true);
    expect(headers[1][0].position.isLastPinnedLeft).toBeFalsy();
    expect(headers[1][1].position.isLastPinnedLeft).toBe(true);
  });

  it('для вложенной ветки считает colSpan по листьям всех уровней', () => {
    const headers = transformColumns(
      [
        column('Медали', {
          columns: [
            column('Команда', {
              columns: [column('Золото'), column('Серебро')],
            }),
          ],
        }),
      ],
      3,
    );

    expect(headers[0][0].position.colSpan).toBe(2);
    expect(headers[1][0].position.colSpan).toBe(2);
    expect(headers[2][0].position).toMatchObject({
      gridIndex: 0,
      level: 2,
      rowSpan: 1,
    });
  });
});
