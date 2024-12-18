import { Example } from '@consta/stand';
import { action, atom } from '@reatom/core';
import { useAction, useAtom } from '@reatom/npm-react';
import React from 'react';

import { DataNumberingCell } from '##/components/DataNumberingCell';
import { Table, TableColumn, TableRenderCell } from '##/components/Table';

// Types

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

// Atoms

const hoveredIdAtom = atom<ROW['id'] | undefined>(undefined);

// Actions

const onRowMouseEnterAction = action<[ROW]>((ctx, row) =>
  hoveredIdAtom(ctx, row.id),
);

const onRowMouseLeaveAction = action<[ROW]>((ctx, row) => {
  const hoveredId = ctx.get(hoveredIdAtom);
  if (hoveredId === row.id) {
    hoveredIdAtom(ctx, undefined);
  }
});

const DataCellName: TableRenderCell<ROW> = (props) => {
  const [hovered] = useAtom((ctx) => {
    const hoveredId = ctx.spy(hoveredIdAtom);
    return hoveredId === props.row.id;
  });

  return (
    <DataNumberingCell data-row-hover={hovered}>
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

export const TableExampleHoveredControlled = () => {
  const onRowMouseEnter = useAction(onRowMouseEnterAction);
  const onRowMouseLeave = useAction(onRowMouseLeaveAction);

  return (
    <Example col={1}>
      <Table
        rows={rows}
        columns={columns}
        zebraStriped
        onRowMouseEnter={onRowMouseEnter}
        onRowMouseLeave={onRowMouseLeave}
        rowHoverEffect
      />
    </Example>
  );
};
