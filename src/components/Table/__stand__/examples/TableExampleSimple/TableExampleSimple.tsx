import { Example } from '@consta/stand';
import React, { useState } from 'react';

import { Table, TableColumn, TableRenderCell } from '##/components/Table';
import { TextFieldCell } from '##/components/TextFieldCell';

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
  {
    name: 'Василий',
    profession: 'Отвечает на вопросы, хотя его не спросили',
    status: 'на связи',
  },
  {
    name: 'Василий',
    profession: 'Отвечает на вопросы, хотя его не спросили',
    status: 'на связи',
  },
];

const RenderCell: TableRenderCell<Row> = (row) => {
  const [value, setValue] = useState<string[] | null>([row.row.name]);
  return (
    <TextFieldCell
      type="textarray"
      value={value}
      onChange={setValue}
      lineClamp={3}
      style={{ maxHeight: 100 }}
      readModeRender={(value) => value?.join(', ')}
      // rows={3}
      // rows="auto"
      size="s"
    />
  );
};

const columns: TableColumn<Row>[] = [
  {
    title: 'Имя',
    accessor: 'name',
    renderCell: RenderCell,
  },
  {
    title: 'Профессия',
    accessor: 'profession',
    renderCell: RenderCell,
  },
  {
    title: 'Статус',
    renderCell: RenderCell,
    accessor: 'status',
  },
];

export const TableExampleSimple = () => (
  <Example col={1}>
    <Table rows={rows} columns={columns} />
  </Example>
);
