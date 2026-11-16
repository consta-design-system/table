import { Example } from '@consta/stand';
import { Checkbox } from '@consta/uikit/Checkbox';
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

const columns: TableColumn<ROW>[] = [
  {
    title: 'Checkbox',
    accessor: 'checkbox',
    colSpan: () => 2,
    mergeCells: (props) => {
      return props.row.athlete;
    },
    renderHeaderCell: () => {
      return <DataCell control={<Checkbox checked={false} />} />;
    },
    renderCell: (props) => {
      return (
        <DataCell control={<Checkbox checked={false} />}>
          {props.row.athlete || 'without a name'}
        </DataCell>
      );
    },

    minWidth: 56,
    maxWidth: 56,
  },
  {
    title: 'Имя',
    accessor: 'athlete',
    minWidth: 200,
  },
  {
    title: 'Страна',
    accessor: 'country',
    minWidth: 100,
    mergeCells: ({ row: { country, athlete } }) => `${country}-${athlete}`,
  },
  {
    title: 'Год',
    accessor: 'year',
    minWidth: 66,
    maxWidth: 66,
  },
  {
    title: 'Медали',
    accessor: 'year',
    columns: [
      {
        title: 'Золото',
        accessor: 'gold',
        minWidth: 96,
        maxWidth: 96,
      },
      {
        title: 'Серебро',
        accessor: 'silver',
        minWidth: 96,
        maxWidth: 96,
      },
      {
        title: 'Бронза',
        accessor: 'bronze',
        minWidth: 96,
        maxWidth: 96,
      },
    ],
  },
];

export const TableExampleMergeCellsVerticalAndHorizontal = () => (
  <Example col={1}>
    <div>
      <Table
        style={{ maxHeight: 600 }}
        rows={rows.sort((a, b) => a.athlete.localeCompare(b.athlete))}
        columns={columns}
        stickyHeader
        virtualScroll
      />
    </div>
  </Example>
);
