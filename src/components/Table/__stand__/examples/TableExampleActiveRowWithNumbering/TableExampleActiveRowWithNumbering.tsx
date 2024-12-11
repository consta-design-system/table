import { Example } from '@consta/stand';
import { action, atom, AtomMut } from '@reatom/core';
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

const activeIdsAtom = atom<Record<ROW['id'], AtomMut<boolean>>>({});
const hoverIdAtom = atom<ROW['id'] | undefined>(undefined);

// Actions

const onRowClickAction = action<[ROW]>((ctx, row) => {
  const activeIds = ctx.get(activeIdsAtom);
  const activeAtom = ctx.get(activeIdsAtom)[row.id];
  if (activeAtom) {
    activeAtom(ctx, !ctx.get(activeAtom));
  } else {
    activeIdsAtom(ctx, { ...activeIds, [row.id]: atom(true) });
  }
});

const onRowMouseEnterAction = action<[ROW]>((ctx, row) =>
  hoverIdAtom(ctx, row.id),
);

const onRowMouseLeaveAction = action<[ROW]>((ctx, row) => {
  const hoveredId = ctx.get(hoverIdAtom);
  if (hoveredId === row.id) {
    hoverIdAtom(ctx, undefined);
  }
});

const DataCellName: TableRenderCell<ROW> = (props) => {
  const [active] = useAtom((ctx) => {
    const activeAtom = ctx.spy(activeIdsAtom)[props.row.id];
    return activeAtom ? ctx.spy(activeAtom) : false;
  });

  const [hovered] = useAtom((ctx) => {
    const hoveredId = ctx.spy(hoverIdAtom);
    return hoveredId === props.row.id;
  });

  return (
    <DataNumberingCell data-row-active={active}>
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

export const TableExampleActiveRowWithNumbering = () => {
  const onRowClick = useAction(onRowClickAction);
  const onRowMouseEnter = useAction(onRowMouseEnterAction);
  const onRowMouseLeave = useAction(onRowMouseLeaveAction);

  return (
    <Example col={1}>
      <Table
        rows={rows}
        columns={columns}
        zebraStriped
        onRowClick={onRowClick}
        onRowMouseEnter={onRowMouseEnter}
        onRowMouseLeave={onRowMouseLeave}
        rowHoverEffect
      />
    </Example>
  );
};
