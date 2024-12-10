import { Example } from '@consta/stand';
import { Checkbox } from '@consta/uikit/Checkbox';
import { useFlag } from '@consta/uikit/useFlag';
import React from 'react';

import { DataCell } from '##/components/DataCell';
import { Table, TableColumn, TableRenderCell } from '##/components/Table';

type ROW = {
  id: number;
  name: string;
  profession: string;
  status: string;
};

const rows: ROW[] = [
  {
    id: 1,
    name: 'Антон Григорьев',
    profession: 'Строитель, который построил дом',
    status: 'недоступен',
  },
  {
    id: 2,
    name: 'Василий Пупкин',
    profession: 'Отвечает на вопросы, хотя его не спросили',
    status: 'на связи',
  },
];

const DataCellName: TableRenderCell<ROW> = (props) => {
  const [active, setActive] = useFlag();

  return (
    <DataCell
      data-row-active={active}
      control={
        <Checkbox size="s" checked={active} onChange={setActive.toggle} />
      }
    >
      {props.row.name}
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
  },
];

export const TableExampleActiveRow = () => (
  <Example col={1}>
    <Table rows={rows} columns={columns} zebraStriped />
  </Example>
);
