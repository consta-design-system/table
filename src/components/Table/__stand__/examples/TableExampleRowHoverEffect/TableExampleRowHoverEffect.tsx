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

const columns: TableColumn<ROW>[] = [
  {
    title: 'Имя',
    width: 'auto',
    accessor: 'athlete',
  },
  {
    title: 'Страна',
    accessor: 'country',
    width: 'auto',
  },
  {
    title: 'Возраст',
    accessor: 'age',
    minWidth: 100,
  },
];

export const TableExampleRowHoverEffect = () => (
  <Example col={1}>
    <div>
      <Table
        style={{ maxHeight: 400 }}
        rows={rows}
        columns={columns}
        stickyHeader
        virtualScroll
        rowHoverEffect
      />
    </div>
  </Example>
);
