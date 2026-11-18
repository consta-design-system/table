import { Example } from '@consta/stand';
import React from 'react';

import { DataNumberingCell } from '##/components/DataNumberingCell';
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
  // {
  //   title: '№',
  //   width: 'auto',
  //   accessor: '№',
  //   maxWidth: 46,
  //   minWidth: 46,
  //   pinned: 'left',
  //   renderCell: ({ rowIndex }) => (
  //     <DataNumberingCell style={{ minHeight: 48 }}>
  //       {rowIndex + 1}
  //     </DataNumberingCell>
  //   ),
  // },
  {
    title: 'Имя',
    width: 'auto',
    accessor: 'athlete',
    mergeCells: (props) => {
      return props.row.athlete;
    },
    // renderCell: ({ row: { athlete }, rowIndex }) => `${rowIndex} ${athlete}`,
  },
  {
    title: 'Страна',
    accessor: 'country',
    width: 'auto',
    mergeCells: ({ row: { country } }) => `${country}`,
  },
  {
    title: 'Возраст',
    accessor: 'age',
    minWidth: 100,
    mergeCells: ({ row: { athlete, age } }) => `${age}-${athlete}`,
  },
];

export const TableExampleMergeCells = () => (
  <Example col={1}>
    <div>
      <Table
        style={{ maxHeight: 400 }}
        rows={rows
          .slice(0, 300)
          .sort((a, b) => a.athlete.localeCompare(b.athlete))}
        columns={columns}
        stickyHeader
        virtualScroll
        resizable="outside"
      />
    </div>
  </Example>
);
