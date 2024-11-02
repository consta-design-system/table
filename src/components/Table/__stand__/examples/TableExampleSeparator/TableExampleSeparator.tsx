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
    minWidth: 180,
  },
  {
    title: 'Разделитель',
    isSeparator: true,
  },
  {
    title: 'Профессия',
    accessor: 'profession',
    minWidth: 180,
  },
  {
    isSeparator: true,
  },
  {
    title: 'Статус',
    accessor: 'status',
    minWidth: 180,
  },
];

export const TableExampleSeparator = () => (
  <Example col={1}>
    <Table rows={rows} columns={columns} />
  </Example>
);
