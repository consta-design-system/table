import { Example } from '@consta/stand';
import React from 'react';

import {
  Table,
  TableColumn,
  TableRenderCell,
  TableRenderHeaderCell,
} from '##/components/Table';
import data from '##/components/Table/__mocks__/olympic-winners.json';

import { DataNumberingCell } from '../../..';

type ROW = {
  athlete: string;
  age: number | null;
  country: string;
  number?: never;
};

const rows: ROW[] = data;

const renderHeaderNumberingCell: TableRenderHeaderCell = (props) => (
  <DataNumberingCell>{props.title}</DataNumberingCell>
);
const renderNumberingCell: TableRenderCell<ROW> = (props) => (
  <DataNumberingCell>{props.rowIndex + 1}</DataNumberingCell>
);

const columns: TableColumn<ROW>[] = [
  {
    title: '',
    accessor: 'number',
    renderCell: renderNumberingCell,
    width: 48,
    minWidth: 48,
  },
  {
    title: 'Имя',
    columns: [
      {
        title: 'A',
        accessor: 'athlete',
        renderHeaderCell: renderHeaderNumberingCell,
        minWidth: 140,
        width: '1fr',
      },
    ],
  },
  {
    title: 'Страна',
    columns: [
      {
        title: 'B',
        accessor: 'country',
        renderHeaderCell: renderHeaderNumberingCell,
        minWidth: 140,
        width: '1fr',
      },
    ],
  },
  {
    title: 'Возраст',
    columns: [
      {
        title: 'C',
        accessor: 'age',
        renderHeaderCell: renderHeaderNumberingCell,
        minWidth: 140,
        width: '1fr',
      },
    ],
  },
];

export const DataNumberingCellExampleTable = () => (
  <Example col={1}>
    <div>
      <Table
        style={{ maxHeight: 400 }}
        rows={rows}
        columns={columns}
        stickyHeader
        virtualScroll
        zebraStriped
      />
    </div>
  </Example>
);
