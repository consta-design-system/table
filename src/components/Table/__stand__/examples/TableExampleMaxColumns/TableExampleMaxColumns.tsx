import { Example } from '@consta/stand';
import React, { memo } from 'react';

import { DataCell } from '##/components/DataCell';
import { Table, TableColumn } from '##/components/Table';
import { range } from '##/utils/array';

const rows = range(10000);
const columns = range(100).map((number) => {
  const column: TableColumn<number> = {
    title: `Колонка - ${number}`,
    accessor: `accessor${number}`,
    width: 100,
    minWidth: 100,
    renderCell: memo(({ row }) => <DataCell>{`${row} - ${number}`}</DataCell>),
  };
  return column;
});

export const TableExampleMaxColumns = () => (
  <Example col={1}>
    <Table
      style={{ maxHeight: 1200 }}
      rows={rows}
      columns={columns}
      zebraStriped
      virtualScroll
      getRowKey={(row) => row}
    />
  </Example>
);
