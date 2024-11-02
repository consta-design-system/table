import { Example } from '@consta/stand';
import React from 'react';

import { Table, TableColumn } from '##/components/Table';

type Row = { name: string; profession: string; status: string };

const rows: Row[] = [
  {
    name: 'Антон',
    profession: 'Строитель, который построил дом',
    status: 'недоступен',
  },
  {
    name: 'Василий',
    profession: 'Отвечает на вопросы, хотя его не спросили',
    status: 'на связи',
  },
];

const columns: TableColumn<Row>[] = [
  {
    title: 'Имя',
    accessor: 'name',
    width: 180,
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

export const TableExampleWidth = () => (
  <Example col={1}>
    <Table rows={rows} columns={columns} />
  </Example>
);
