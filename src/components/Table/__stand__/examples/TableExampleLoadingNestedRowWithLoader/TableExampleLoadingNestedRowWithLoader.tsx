import { IconArrowRight } from '@consta/icons/IconArrowRight';
import { Example } from '@consta/stand';
import { Button } from '@consta/uikit/Button';
import React from 'react';

import { DataCell } from '##/components/DataCell';
import { Table, TableColumn, TableRenderCell } from '##/components/Table';

type Item = {
  id: number;
  label: string;
  loading?: boolean;
};

type Row = Item;

const data: Row[] = [
  { id: 1, label: 'Item 1' },
  { id: 2, label: 'Item 2' },
  { id: 3, label: 'Item 3' },
  { id: 4, label: 'Item 4', loading: true },
  { id: 5, label: 'Item 5' },
  { id: 6, label: 'Item 6' },
  { id: 7, label: 'Item 7' },
];

const renderIdCell: TableRenderCell<Row> = ({ row }) => (
  <DataCell
    control={
      <Button
        iconLeft={IconArrowRight}
        size="s"
        view="clear"
        loading={row.loading}
      />
    }
  >
    {row.id}
  </DataCell>
);

const columns: TableColumn<Row>[] = [
  {
    title: 'Номер',
    accessor: 'id',
    renderCell: renderIdCell,
    minWidth: 300,
  },
  {
    title: 'Наименование',
    accessor: 'label',
    minWidth: 300,
  },
];

export const TableExampleLoadingNestedRowWithLoader = () => {
  return (
    <Example col={1}>
      <Table
        style={{ maxHeight: 500 }}
        rows={data}
        columns={columns}
        stickyHeader
        getRowKey={(row) => row.id}
      />
    </Example>
  );
};
