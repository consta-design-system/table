import { Example } from '@consta/stand';
import { Badge, BadgePropStatus } from '@consta/uikit/Badge';
import { Checkbox } from '@consta/uikit/Checkbox';
import { useFlag } from '@consta/uikit/useFlag';
import React from 'react';

import { DataCell } from '##/components/DataCell';
import { Table, TableColumn, TableRenderCell } from '##/components/Table';

type ROW = {
  name: string;
  profession: string;
  status: 'not available' | 'available';
};

const rows: ROW[] = [
  {
    name: 'Антон Григорьев',
    profession: 'Строитель, который построил дом',
    status: 'not available',
  },
  {
    name: 'Василий Пупкин',
    profession: 'Отвечает на вопросы, хотя его не спросили',
    status: 'available',
  },
];

const DataCellName: TableRenderCell<ROW> = (props) => {
  const [checked, setChecked] = useFlag();
  return (
    <DataCell
      control={
        <Checkbox size="s" checked={checked} onChange={setChecked.toggle} />
      }
    >
      {props.row.name}
    </DataCell>
  );
};

const mapBadgeProps: Record<
  ROW['status'],
  { status: BadgePropStatus; label: string }
> = {
  'available': {
    status: 'success',
    label: 'на связи',
  },
  'not available': {
    status: 'warning',
    label: 'недоступен',
  },
};

const DataCellStatus: TableRenderCell<ROW> = (props) => {
  return (
    <DataCell>
      <Badge {...mapBadgeProps[props.row.status]} />
    </DataCell>
  );
};

const columns: TableColumn<ROW>[] = [
  {
    title: 'Имя',
    accessor: 'name',
    width: 240,
    renderCell: DataCellName,
  },
  {
    title: 'Профессия',
    accessor: 'profession',
    width: '1fr',
  },
  {
    title: 'Статус',
    accessor: 'status',
    width: '1fr',
    minWidth: 150,
    renderCell: DataCellStatus,
  },
];

export const TableExampleRenderCell = () => (
  <Example col={1}>
    <Table rows={rows} columns={columns} />
  </Example>
);
