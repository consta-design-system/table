import {
  createRoot,
  testRootId,
  tick,
} from '@consta/uikit/__internal__/src/utils/vitest';
import { presetGpnDefault, Theme } from '@consta/uikit/Theme';
import { clearStack, context, top, wrap } from '@reatom/core';
import { reatomContext } from '@reatom/react';
import { act, fireEvent } from '@testing-library/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { describe, expect, test, vi } from 'vitest';

import { cn } from '../../../utils/bem';
import { Table, TableColumn, TableProps } from '../index';

createRoot();
clearStack();

const cnTableBody = cn('TableBody');
const cnTableHeader = cn('TableHeader');
const cnTableRow = cn('TableRow');
const cnTableRowCell = cn('TableRowCell');
const cnTableData = cn('TableData');
const cnTableResizers = cn('TableResizers');

/**
 * testId - идентификатор data-testid, используемый для поиска компонента в тестах.
 */
const testId = cnTableBody();

type Row = {
  id: number;
  name: string;
  profession: string;
  status: string;
};

const defaultRows: Row[] = [
  { id: 1, name: 'Антон', profession: 'Строитель', status: 'недоступен' },
  { id: 2, name: 'Василий', profession: 'Отвечает', status: 'на связи' },
];

const defaultColumns: TableColumn<Row>[] = [
  { title: 'Имя', accessor: 'name' },
  { title: 'Профессия', accessor: 'profession' },
  { title: 'Статус', accessor: 'status' },
];

type AttachmentProps = TableProps<Row>;

const renderComponent = (props: Partial<AttachmentProps>) => {
  const root = ReactDOM.createRoot(
    document.querySelector(`*[data-test-block=${testRootId()}]`)!,
  );

  act(() => {
    root.render(
      <reatomContext.Provider value={top()}>
        <Theme preset={presetGpnDefault}>
          <Table
            data-testid={testId}
            rows={defaultRows}
            columns={defaultColumns}
            {...props}
          />
        </Theme>
      </reatomContext.Provider>,
    );
  });
};

const getRender = () =>
  document.querySelector(
    `*[data-test-block=${testRootId()}] *[data-testid=${testId}]`,
  ) as HTMLDivElement;

/**
 * Проверяет, что в className элемента присутствуют все классы из переданной строки.
 * cn с модификаторами возвращает несколько классов через пробел,
 * поэтому нельзя использовать classList.contains напрямую.
 */
const hasClassName = (el: Element | null, className: string) =>
  !!el && className.split(' ').every((token) => el.classList.contains(token));

const getHeaderCells = () =>
  Array.from(
    getRender().querySelectorAll(`.${cnTableHeader('Cell')}`),
  ) as HTMLElement[];

const getRows = () =>
  Array.from(getRender().querySelectorAll(`.${cnTableRow()}`)) as HTMLElement[];

const getRowCells = (rowIndex: number) =>
  Array.from(
    getRows()[rowIndex].querySelectorAll(`.${cnTableRowCell()}`),
  ) as HTMLElement[];

const getStyleContent = () =>
  Array.from(getRender().querySelectorAll('style'))
    .map((el) => el.textContent || '')
    .join('');

describe('Компонент Table', () => {
  describe('рендер корневого элемента', () => {
    test('должен рендериться без ошибок', () =>
      context.start(async () => {
        expect(() => renderComponent({})).not.toThrow();

        const render = getRender();

        expect(render).toBeTruthy();
        expect(render.tagName).toBe('DIV');
      }));

    test('должен пробрасывать className', () =>
      context.start(async () => {
        renderComponent({ className: 'custom-class' });

        expect(getRender().className).toContain('custom-class');
      }));

    test('должен пробрасывать style через ...otherProps', () =>
      context.start(async () => {
        renderComponent({ style: { color: 'red' } });

        expect(getRender().style.color).toBe('red');
      }));

    test('должен пробрасывать прочие атрибуты div через ...otherProps', () =>
      context.start(async () => {
        renderComponent({ 'aria-label': 'table' });

        expect(getRender().getAttribute('aria-label')).toBe('table');
      }));

    test('должен пробрасывать ref на корневой элемент', () =>
      context.start(async () => {
        const ref = React.createRef<HTMLDivElement>();

        renderComponent({ ref });

        expect(ref.current).toBe(getRender());
      }));
  });

  describe('строки и колонки', () => {
    test('рендерит заголовки колонок', () =>
      context.start(async () => {
        renderComponent({});

        const headerCells = getHeaderCells();

        expect(headerCells.length).toBe(3);
        expect(headerCells[0].textContent).toContain('Имя');
        expect(headerCells[1].textContent).toContain('Профессия');
        expect(headerCells[2].textContent).toContain('Статус');
      }));

    test('рендерит данные ячеек по accessor', () =>
      context.start(async () => {
        renderComponent({});

        const rows = getRows();

        expect(rows.length).toBe(2);

        const firstRowCells = getRowCells(0);

        expect(firstRowCells.length).toBe(3);
        expect(firstRowCells[0].textContent).toContain('Антон');
        expect(firstRowCells[1].textContent).toContain('Строитель');
        expect(firstRowCells[2].textContent).toContain('недоступен');

        const secondRowCells = getRowCells(1);

        expect(secondRowCells[0].textContent).toContain('Василий');
        expect(secondRowCells[1].textContent).toContain('Отвечает');
        expect(secondRowCells[2].textContent).toContain('на связи');
      }));

    test('рендерится без ошибок при пустых rows', () =>
      context.start(async () => {
        expect(() => renderComponent({ rows: [] })).not.toThrow();

        expect(getRows().length).toBe(0);
      }));

    test('рендерится без ошибок при пустых columns', () =>
      context.start(async () => {
        expect(() => renderComponent({ columns: [] })).not.toThrow();
      }));
  });

  describe('свойство renderCell', () => {
    test('рендерит кастомное содержимое ячейки', () =>
      context.start(async () => {
        const columns: TableColumn<Row>[] = [
          {
            title: 'Имя',
            accessor: 'name',
            renderCell: ({ row }) => <span data-custom-cell>{row.name}</span>,
          },
          { title: 'Профессия', accessor: 'profession' },
        ];

        renderComponent({ columns });

        const cell = getRowCells(0)[0];

        expect(cell.querySelector('[data-custom-cell]')).toBeTruthy();
        expect(cell.textContent).toContain('Антон');
      }));

    test('передаёт в renderCell корректные row, rowIndex и columnIndex', () =>
      context.start(async () => {
        const renderCell = vi.fn(
          ({
            row,
            rowIndex,
            columnIndex,
          }: {
            row: Row;
            rowIndex: number;
            columnIndex: number;
          }) => (
            <span data-custom-cell>
              {row.name}-{rowIndex}-{columnIndex}
            </span>
          ),
        );

        const columns: TableColumn<Row>[] = [
          { title: 'Имя', accessor: 'name', renderCell },
          { title: 'Профессия', accessor: 'profession' },
        ];

        renderComponent({ columns });

        expect(renderCell).toHaveBeenCalled();

        const call = renderCell.mock.calls[0][0];

        expect(call.row).toEqual(defaultRows[0]);
        expect(call.rowIndex).toBe(0);
        expect(call.columnIndex).toBe(0);
      }));
  });

  describe('свойство renderHeaderCell', () => {
    test('рендерит кастомное содержимое ячейки шапки', () =>
      context.start(async () => {
        const columns: TableColumn<Row>[] = [
          {
            title: 'Имя',
            accessor: 'name',
            renderHeaderCell: ({ title }) => (
              <span data-custom-header>{title}</span>
            ),
          },
          { title: 'Профессия', accessor: 'profession' },
        ];

        renderComponent({ columns });

        const headerCell = getHeaderCells()[0];

        expect(headerCell.querySelector('[data-custom-header]')).toBeTruthy();
        expect(headerCell.textContent).toContain('Имя');
      }));

    test('передаёт в renderHeaderCell корректные title и index', () =>
      context.start(async () => {
        const renderHeaderCell = vi.fn(
          ({ title, index }: { title?: string; index: number }) => (
            <span data-custom-header>
              {title}-{index}
            </span>
          ),
        );

        const columns: TableColumn<Row>[] = [
          { title: 'Имя', accessor: 'name', renderHeaderCell },
          { title: 'Профессия', accessor: 'profession' },
        ];

        renderComponent({ columns });

        expect(renderHeaderCell).toHaveBeenCalled();
        expect(renderHeaderCell.mock.calls[0][0].title).toBe('Имя');
        expect(renderHeaderCell.mock.calls[0][0].index).toBe(0);
      }));
  });

  describe('свойство colSpan', () => {
    test('объединяет ячейки при числовом colSpan', () =>
      context.start(async () => {
        renderComponent({
          columns: [
            { title: 'Имя', accessor: 'name', colSpan: () => 2 },
            { title: 'Профессия', accessor: 'profession' },
            { title: 'Статус', accessor: 'status' },
          ],
        });

        const firstRowCells = getRowCells(0);

        expect(firstRowCells.length).toBe(2);
        expect(firstRowCells[0].style.gridColumn).toBe('1 / span 2');
      }));

    test('растягивает ячейку до конца строки при colSpan = end', () =>
      context.start(async () => {
        renderComponent({
          columns: [
            { title: 'Имя', accessor: 'name', colSpan: () => 'end' },
            { title: 'Профессия', accessor: 'profession' },
            { title: 'Статус', accessor: 'status' },
          ],
        });

        const firstRowCells = getRowCells(0);

        expect(firstRowCells.length).toBe(1);
        expect(firstRowCells[0].style.gridColumn).toBe('1 / span 3');
      }));
  });

  describe('свойство pinned', () => {
    test('закрепляет колонку слева', () =>
      context.start(async () => {
        renderComponent({
          columns: [
            { title: 'Имя', accessor: 'name', pinned: 'left' },
            { title: 'Профессия', accessor: 'profession' },
          ],
        });

        const firstRowCells = getRowCells(0);

        expect(firstRowCells[0].style.left).toContain(
          '--table-column-sticky-left-offset',
        );
        expect(firstRowCells[1].style.left).toBe('');
      }));

    test('закрепляет колонку справа', () =>
      context.start(async () => {
        renderComponent({
          columns: [
            { title: 'Имя', accessor: 'name' },
            { title: 'Профессия', accessor: 'profession', pinned: 'right' },
          ],
        });

        const firstRowCells = getRowCells(0);

        expect(firstRowCells[1].style.right).toContain(
          '--table-column-sticky-right-offset',
        );
        expect(firstRowCells[0].style.right).toBe('');
      }));
  });

  describe('свойство isSeparator', () => {
    test('рендерит пустую ячейку-разделитель', () =>
      context.start(async () => {
        renderComponent({
          columns: [
            { title: 'Имя', accessor: 'name' },
            { title: 'Разделитель', isSeparator: true },
            { title: 'Профессия', accessor: 'profession' },
          ],
        });

        const firstRowCells = getRowCells(0);

        expect(firstRowCells.length).toBe(3);
        expect(firstRowCells[1].textContent).toBe('');
      }));
  });

  describe('группировка колонок', () => {
    test('рендерит вложенные колонки', () =>
      context.start(async () => {
        renderComponent({
          columns: [
            {
              title: 'Работник',
              columns: [
                { title: 'Имя', accessor: 'name' },
                { title: 'Профессия', accessor: 'profession' },
              ],
            },
            { title: 'Статус', accessor: 'status' },
          ],
        });

        const headerCells = getHeaderCells();

        expect(headerCells.length).toBe(4);
        expect(headerCells[0].textContent).toContain('Работник');
        expect(headerCells[0].style.gridColumnEnd).toBe('span 2');
        expect(headerCells[2].textContent).toContain('Имя');
        expect(headerCells[3].textContent).toContain('Профессия');
      }));
  });

  describe('свойство stickyHeader', () => {
    test('применяет sticky-позиционирование к ячейкам шапки', () =>
      context.start(async () => {
        renderComponent({ stickyHeader: true });

        const headerCells = getHeaderCells();

        expect(headerCells[0].style.top).toContain(
          '--table-column-sticky-top-offset',
        );
      }));

    test('не применяет sticky-позиционирование без stickyHeader', () =>
      context.start(async () => {
        renderComponent({});

        const headerCells = getHeaderCells();

        expect(headerCells[0].style.top).toBe('');
      }));
  });

  describe('свойство zebraStriped', () => {
    test('добавляет модификатор zebraStriped нечётным строкам', () =>
      context.start(async () => {
        renderComponent({ zebraStriped: true });

        const rows = getRows();

        expect(hasClassName(rows[0], cnTableRow({ zebraStriped: true }))).toBe(
          false,
        );
        expect(hasClassName(rows[1], cnTableRow({ zebraStriped: true }))).toBe(
          true,
        );
      }));

    test('не добавляет модификатор zebraStriped по умолчанию', () =>
      context.start(async () => {
        renderComponent({});

        const rows = getRows();

        expect(hasClassName(rows[1], cnTableRow({ zebraStriped: true }))).toBe(
          false,
        );
      }));
  });

  describe('свойство rowHoverEffect', () => {
    test('добавляет модификатор rowHoverEffect контейнеру данных', () =>
      context.start(async () => {
        renderComponent({ rowHoverEffect: true });

        const data = getRender().querySelector(`.${cnTableData()}`);

        expect(hasClassName(data, cnTableData({ rowHoverEffect: true }))).toBe(
          true,
        );
      }));

    test('не добавляет модификатор rowHoverEffect по умолчанию', () =>
      context.start(async () => {
        renderComponent({});

        const data = getRender().querySelector(`.${cnTableData()}`);

        expect(hasClassName(data, cnTableData({ rowHoverEffect: true }))).toBe(
          false,
        );
      }));
  });

  describe('свойство resizable', () => {
    test('рендерит ресайзеры для всех колонок в режиме outside', () =>
      context.start(async () => {
        renderComponent({ resizable: 'outside' });

        const resizers = getRender().querySelectorAll(
          `.${cnTableResizers('Resizer')}`,
        );

        expect(resizers.length).toBe(3);
      }));

    test('не рендерит ресайзер для последней колонки в режиме inside', () =>
      context.start(async () => {
        renderComponent({ resizable: 'inside' });

        const resizers = getRender().querySelectorAll(
          `.${cnTableResizers('Resizer')}`,
        );

        expect(resizers.length).toBe(2);
      }));

    test('не рендерит ресайзеры без resizable', () =>
      context.start(async () => {
        renderComponent({});

        const resizers = getRender().querySelectorAll(
          `.${cnTableResizers('Resizer')}`,
        );

        expect(resizers.length).toBe(0);
      }));
  });

  describe('свойство headerZIndex', () => {
    test('по умолчанию headerZIndex = 1', () =>
      context.start(async () => {
        renderComponent({});

        expect(getStyleContent()).toContain('--table-header-z-index: 1');
      }));

    test('применяет переданный headerZIndex', () =>
      context.start(async () => {
        renderComponent({ headerZIndex: 5 });

        expect(getStyleContent()).toContain('--table-header-z-index: 5');
      }));
  });

  describe('события строк', () => {
    test('onRowClick вызывается при клике на ячейку строки', () =>
      context.start(async () => {
        const onRowClick = vi.fn();

        renderComponent({ onRowClick });

        const cell = getRowCells(0)[0];

        fireEvent.click(cell);

        expect(onRowClick).toHaveBeenCalledTimes(1);
        expect(onRowClick.mock.calls[0][0]).toEqual(defaultRows[0]);
      }));

    test('onRowMouseEnter вызывается при наведении на ячейку строки', () =>
      context.start(async () => {
        const onRowMouseEnter = vi.fn();

        renderComponent({ onRowMouseEnter });

        const cell = getRowCells(1)[0];

        fireEvent.mouseEnter(cell);

        expect(onRowMouseEnter).toHaveBeenCalledTimes(1);
        expect(onRowMouseEnter.mock.calls[0][0]).toEqual(defaultRows[1]);
      }));

    test('onRowMouseLeave вызывается при уходе с ячейки строки', () =>
      context.start(async () => {
        const onRowMouseLeave = vi.fn();

        renderComponent({ onRowMouseLeave });

        const cell = getRowCells(0)[0];

        fireEvent.mouseLeave(cell);

        expect(onRowMouseLeave).toHaveBeenCalledTimes(1);
        expect(onRowMouseLeave.mock.calls[0][0]).toEqual(defaultRows[0]);
      }));
  });

  describe('свойство getRowKey', () => {
    test('рендерится без ошибок с кастомным getRowKey', () =>
      context.start(async () => {
        expect(() =>
          renderComponent({ getRowKey: (row: Row) => `key-${row.id}` }),
        ).not.toThrow();

        expect(getRows().length).toBe(2);
      }));
  });

  describe('свойство virtualScroll', () => {
    test('рендерится без ошибок при virtualScroll', () =>
      context.start(async () => {
        expect(() => renderComponent({ virtualScroll: true })).not.toThrow();

        await wrap(tick());
      }));

    test('рендерится без ошибок при virtualScroll = [true, true]', () =>
      context.start(async () => {
        expect(() =>
          renderComponent({ virtualScroll: [true, true] }),
        ).not.toThrow();

        await wrap(tick());
      }));
  });
});
