import { Example } from '@consta/stand';
import React from 'react';

import { Table, TableColumn } from '##/components/Table';

type Row = { name: string; profession: string; status: string };

const rows: Row[] = [
  {
    name: 'Антон',
    profession: 'Cтроитель, который построил дом',
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
  },
  {
    title: 'Профессия',
    accessor: 'profession',
  },
  {
    title: 'Статус',
    accessor: 'status',
  },
];

export const TableExampleSimple = () => (
  <Example col={1}>
    <Table rows={rows} columns={columns} />
  </Example>
);
