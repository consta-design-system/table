import { Example } from '@consta/stand';
import { Loader } from '@consta/uikit/Loader';
import React from 'react';

import { DataCell } from '##/components/DataCell';
import { Table, TableColumn, TableRenderCell } from '##/components/Table';

type Item = {
  id: number;
  label: string;
};

type Loader = {
  isLoader: true;
};

type Row = Item | Loader;

const data: Row[] = [{ isLoader: true }];

const isLoader = (arg: Row): arg is Loader =>
  Object.prototype.hasOwnProperty.call(arg, 'isLoader');

const renderIdCell: TableRenderCell<Row> = ({ row }) => {
  if (isLoader(row)) {
    return (
      <DataCell>
        <Loader type="circle" />
      </DataCell>
    );
  }
  return <DataCell>{row.id}</DataCell>;
};

const columns: TableColumn<Row>[] = [
  {
    title: 'Номер',
    accessor: 'id',
    renderCell: renderIdCell,
    colSpan: ({ row }) => (isLoader(row) ? 'end' : 1),
    minWidth: 300,
  },
  {
    title: 'Наименование',
    accessor: 'label',
    minWidth: 300,
  },
];

export const TableExampleLoadingDataWithLoader = () => {
  return (
    <Example col={1}>
      <Table
        style={{ maxHeight: 500 }}
        rows={data}
        columns={columns}
        stickyHeader
      />
    </Example>
  );
};
