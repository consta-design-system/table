import { IconFunnel } from '@consta/icons/IconFunnel';
import { IconKebab } from '@consta/icons/IconKebab';
import { IconUnsort } from '@consta/icons/IconUnsort';
import { Example } from '@consta/stand';
import { Button } from '@consta/uikit/Button';
import React from 'react';

import { HeaderDataCell } from '##/components/HeaderDataCell';
import { Table, TableColumn, TableRenderHeaderCell } from '##/components/Table';

type ROW = {
  name: string;
  profession: string;
  status: string;
};

const rows: ROW[] = [
  {
    name: 'Антон Григорьев',
    profession: 'Строитель, который построил дом',
    status: 'недоступен',
  },
  {
    name: 'Василий Пупкин',
    profession: 'Отвечает на вопросы, хотя его не спросили',
    status: 'на связи',
  },
];

const DataHeaderCell: TableRenderHeaderCell = ({ title }) => {
  return (
    <HeaderDataCell
      controlRight={[
        <Button size="s" view="clear" iconLeft={IconUnsort} onlyIcon />,
        <Button size="s" view="clear" iconLeft={IconFunnel} onlyIcon />,
        <Button size="s" view="clear" iconLeft={IconKebab} onlyIcon />,
      ]}
    >
      {title}
    </HeaderDataCell>
  );
};

const columns: TableColumn<ROW>[] = [
  {
    title: 'Имя',
    accessor: 'name',
    width: 240,
    renderHeaderCell: DataHeaderCell,
  },
  {
    title: 'Профессия',
    accessor: 'profession',
    width: '1fr',
    renderHeaderCell: DataHeaderCell,
  },
  {
    title: 'Статус',
    accessor: 'status',
    width: '1fr',
    minWidth: 150,
    renderHeaderCell: DataHeaderCell,
  },
];

export const TableExampleRenderHeaderCell = () => (
  <Example col={1}>
    <Table rows={rows} columns={columns} />
  </Example>
);
