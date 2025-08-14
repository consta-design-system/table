import { Example } from '@consta/stand';
import React from 'react';

import { DataCell } from '##/components/DataCell';
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

const Cell = (props: { title: string | number | null }) => {
  const { title } = props;
  return <DataCell truncate>{title}</DataCell>;
};

const columns: TableColumn<ROW>[] = [
  {
    title: 'Имя',
    width: 'auto',
    accessor: 'athlete',
    minWidth: 200,
    renderCell: (props) => <Cell title={props.row.athlete} />,
  },
  {
    title: 'Страна',
    accessor: 'country',
    width: 'auto',
    minWidth: 200,
    renderCell: (props) => <Cell title={props.row.country} />,
  },
  {
    title: 'Возраст',
    accessor: 'age',
    minWidth: 100,
    renderCell: (props) => <Cell title={props.row.age} />,
  },

  {
    title: 'Год',
    accessor: 'year',
    minWidth: 70,
    renderCell: (props) => <Cell title={props.row.year} />,
  },
  {
    title: 'Sport',
    accessor: 'sport',
    minWidth: 200,
    renderCell: (props) => <Cell title={props.row.sport} />,
  },
  {
    title: 'Медали',
    accessor: 'medals',
    columns: [
      {
        title: 'Золото',
        accessor: 'gold',
        minWidth: 100,
        width: 100,
        renderCell: (props) => <Cell title={props.row.gold} />,
      },
      {
        title: 'Серебро',
        accessor: 'silver',
        minWidth: 100,
        width: 100,
        renderCell: (props) => <Cell title={props.row.silver} />,
      },
      {
        title: 'Бронза',
        accessor: 'bronze',
        minWidth: 100,
        width: 100,
        renderCell: (props) => <Cell title={props.row.bronze} />,
      },
      {
        title: 'Всего',
        accessor: 'total',
        minWidth: 100,
        width: 100,
        renderCell: (props) => <Cell title={props.row.total} />,
      },
    ],
  },
];

export const TableExampleVirtualScroll = () => (
  <Example col={1}>
    <div style={{ height: 400 }}>
      <Table
        style={{ maxHeight: '100%' }}
        rows={rows}
        columns={columns}
        stickyHeader
        virtualScroll
      />
    </div>
  </Example>
);
