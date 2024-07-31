import { Example } from '@consta/stand';
import React from 'react';

import { Table, TableColumn } from '##/components/Table';

type Row = {
  firstName: string;
  lastName: string;
  secondName: string;
  profession: string;
  status: string;
  phone: string;
  grade: number;
  email: string;
};

const rows: Row[] = [
  {
    firstName: 'Антон',
    lastName: 'Григорьев',
    secondName: 'Петров',
    profession: 'Cтроитель, который построил дом',
    status: 'недоступен',
    phone: '+7 976 543 21 00',
    email: 'anton@company.ru',
    grade: 3,
  },
  {
    firstName: 'Василий',
    lastName: 'Пупкин',
    secondName: 'Игоревич',
    profession: 'Отвечает на вопросы, хотя его не спросили',
    status: 'на связи',
    phone: '+7 976 543 21 00',
    email: 'vasya@company.ru',
    grade: 3,
  },
];

const columns: TableColumn<Row>[] = [
  {
    title: 'Работник',
    columns: [
      {
        title: 'Фамилия',
        accessor: 'lastName',
        minWidth: 140,
      },
      {
        title: 'Имя',
        accessor: 'firstName',
        minWidth: 140,
      },
      {
        title: 'Отчество',
        accessor: 'secondName',
        minWidth: 140,
      },
    ],
  },
  {
    title: 'Профессия',
    accessor: 'profession',
    minWidth: 200,
  },
  {
    title: 'Статус',
    accessor: 'status',
    minWidth: 140,
  },
  {
    title: 'Грейд',
    accessor: 'grade',
    minWidth: 80,
  },
  {
    title: 'Контакты',
    columns: [
      {
        title: 'Телефон',
        accessor: 'phone',
        minWidth: 200,
      },
      {
        title: 'e-mail',
        accessor: 'email',
        minWidth: 200,
      },
    ],
  },
];

export const TableExampleGroupColums = () => (
  <Example col={1}>
    <Table rows={rows} columns={columns} />
  </Example>
);
