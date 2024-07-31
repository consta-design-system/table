import { Example } from '@consta/stand';
import React from 'react';

import { Table, TableColumn } from '##/components/Table';
import rows from '##/components/Table/__mocks__/olympic-winners.json';

type ROW = {
  athlete: string;
  age: number | null;
  country: string;
  year: number;
  date: string;
  sport: string;
  gold: number;
  silver: number;
  bronze: number;
  total: number;
};

const columnsForInside: TableColumn<ROW>[] = [
  {
    title: 'Имя',
    width: 'auto',
    accessor: 'athlete',
    // Запретили менять ширину
    minWidth: 200,
    maxWidth: 200,
  },
  {
    title: 'Страна',
    accessor: 'country',
    width: 'auto',
    minWidth: 140,
  },
  {
    title: 'Возраст',
    accessor: 'age',
    width: 'auto',
    minWidth: 100,
  },
];

const columnsForOutside: TableColumn<ROW>[] = [
  {
    title: 'Имя',
    width: 'auto',
    accessor: 'athlete',
    minWidth: 200,
  },
  {
    title: 'Страна',
    accessor: 'country',
    width: 'auto',
    minWidth: 140,
    pinned: 'left',
  },
  {
    title: 'Возраст',
    accessor: 'age',
    width: 'auto',
    minWidth: 100,
  },
  {
    title: 'Медали',
    columns: [
      {
        title: 'Бронза',
        accessor: 'bronze',
        width: 'auto',
        minWidth: 100,
      },
      {
        title: 'Серебро',
        accessor: 'silver',
        width: 'auto',
        minWidth: 100,
      },
      {
        title: 'Золото',
        accessor: 'gold',
        width: 'auto',
        minWidth: 100,
      },
      {
        title: 'Всего',
        accessor: 'total',
        width: 'auto',
        minWidth: 100,
      },
    ],
  },
  {
    title: 'Год',
    accessor: 'year',
    width: 'auto',
    minWidth: 140,
    pinned: 'right',
  },
];

export const TableExampleResizableInside = () => (
  <Example col={1}>
    <div>
      <Table
        style={{ maxHeight: 400 }}
        rows={rows}
        columns={columnsForInside}
        stickyHeader
        virtualScroll
        resizable="inside"
        zebraStriped
      />
    </div>
  </Example>
);

export const TableExampleResizableOutside = () => (
  <Example col={1}>
    <div>
      <Table
        style={{ maxHeight: 400 }}
        rows={rows}
        columns={columnsForOutside}
        stickyHeader
        virtualScroll
        resizable="outside"
        zebraStriped
      />
    </div>
  </Example>
);
