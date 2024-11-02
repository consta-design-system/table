import { Example } from '@consta/stand';
import React from 'react';

import { Table, TableColumn } from '##/components/Table';

type Row = {
  name: string;
  profession: string;
  status: string;
  phone: string;
  grade: number;
};

const rows: Row[] = [
  {
    name: 'Антон',
    profession: 'Строитель, который построил дом',
    status: 'недоступен',
    phone: '+7 976 543 21 00',
    grade: 3,
  },
  {
    name: 'Василий',
    profession: 'Отвечает на вопросы, хотя его не спросили',
    status: 'на связи',
    phone: '+7 976 543 21 00',
    grade: 3,
  },
];

const columns: TableColumn<Row>[] = [
  {
    title: 'Имя',
    accessor: 'name',
    pinned: 'left',
    minWidth: 180,
  },
  {
    title: 'Профессия',
    accessor: 'profession',
    minWidth: 360,
  },
  {
    title: 'Статус',
    accessor: 'status',
    minWidth: 200,
  },
  {
    title: 'Телефон',
    accessor: 'phone',
    minWidth: 260,
  },
  {
    title: 'Грейд',
    accessor: 'grade',
    pinned: 'right',
    minWidth: 80,
  },
];

export const TableExamplePinned = () => (
  <Example col={1}>
    <Table rows={rows} columns={columns} />
  </Example>
);
