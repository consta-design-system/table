import { Example } from '@consta/stand';
import { Loader } from '@consta/uikit/Loader';
import { cnMixSpace } from '@consta/uikit/MixSpace';
import { SkeletonBrick } from '@consta/uikit/Skeleton';
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

const data: Row[] = [
  { id: 1, label: 'Item 1' },
  { id: 2, label: 'Item 2' },
  { id: 3, label: 'Item 3' },
  { isLoader: true },
];

const isLoader = (arg: Row): arg is Loader =>
  Object.prototype.hasOwnProperty.call(arg, 'isLoader');

const renderIdCell: TableRenderCell<Row> = ({ row }) => {
  if (isLoader(row)) {
    return (
      <div className={cnMixSpace({ pH: 's', pV: 'm' })}>
        <SkeletonBrick width="100%" height="var(--space-m)" />
      </div>
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

export const TableExampleLoadingRowWithSkeleton = () => {
  return (
    <Example col={1}>
      <Table
        style={{ maxHeight: 500 }}
        rows={data}
        columns={columns}
        stickyHeader
        getRowKey={(row) => (isLoader(row) ? `loader` : `${row.id}`)}
      />
    </Example>
  );
};
