import { Example } from '@consta/stand';
import { useFlag } from '@consta/uikit/useFlag';
import React from 'react';

import { DataNumberingCell } from '##/components/DataNumberingCell';
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
    <DataNumberingCell
      style={{ cursor: 'pointer' }}
      onClick={setActive.toggle}
      data-row-active={active}
    >
      {props.row.id}
    </DataNumberingCell>
  );
};

const columns: TableColumn<ROW>[] = [
  {
    title: '',
    accessor: 'id',
    width: 48,
    maxWidth: 48,
    minWidth: 48,
    renderCell: DataCellName,
  },
  {
    title: 'Имя',
    accessor: 'name',
    width: 240,
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

export const TableExampleActiveRowWithNumbering = () => (
  <Example col={1}>
    <Table rows={rows} columns={columns} zebraStriped />
  </Example>
);
