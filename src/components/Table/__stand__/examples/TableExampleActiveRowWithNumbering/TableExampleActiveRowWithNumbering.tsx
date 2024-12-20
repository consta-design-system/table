import { Example } from '@consta/stand';
import { action, atom, AtomMut } from '@reatom/core';
import { useAction, useAtom } from '@reatom/npm-react';
import React from 'react';

import { DataCell } from '##/components/DataCell';
import { DataNumberingCell } from '##/components/DataNumberingCell';
import { Table, TableColumn, TableRenderCell } from '##/components/Table';

// Types

type ROW = {
  id: number;
  name: string;
  profession: string;
  status: string;
  hover: AtomMut<boolean>;
  active: AtomMut<boolean>;
};

// Atoms
const rowsAtom = atom<AtomMut<ROW>[]>([
  atom({
    id: 1,
    name: 'Антон Григорьев',
    profession: 'Строитель, который построил дом',
    status: 'недоступен',
    hover: atom(false),
    active: atom(false),
  }),
  atom({
    id: 2,
    name: 'Василий Пупкин',
    profession: 'Отвечает на вопросы, хотя его не спросили',
    status: 'на связи',
    hover: atom(false),
    active: atom(false),
  }),
]);

// Actions

const onRowClickAction = action<[AtomMut<ROW>]>((ctx, rowAtom) => {
  const row = ctx.get(rowAtom);
  row.active(ctx, !ctx.get(row.active));
});

const onRowMouseEnterAction = action<[AtomMut<ROW>]>((ctx, rowAtom) => {
  ctx.get(rowAtom).hover(ctx, true);
});

const onRowMouseLeaveAction = action<[AtomMut<ROW>]>((ctx, rowAtom) => {
  ctx.get(rowAtom).hover(ctx, false);
});

const DataCellName: TableRenderCell<AtomMut<ROW>> = (props) => {
  const [row] = useAtom(props.row);
  const [active] = useAtom(row.active);
  const [hover] = useAtom(row.hover);

  return (
    <DataNumberingCell data-row-active={active} data-row-hover={hover}>
      {row.id}
    </DataNumberingCell>
  );
};

const createDataCellOther = (
  accessor: Exclude<keyof ROW, 'hover' | 'active'>,
) => {
  const Component: TableRenderCell<AtomMut<ROW>> = (props) => {
    const [row] = useAtom(props.row);

    return <DataCell>{row[accessor]}</DataCell>;
  };

  return Component;
};

const columns: TableColumn<AtomMut<ROW>>[] = [
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
    renderCell: createDataCellOther('name'),
  },
  {
    title: 'Профессия',
    accessor: 'profession',
    width: '1fr',
    renderCell: createDataCellOther('profession'),
  },
  {
    title: 'Статус',
    accessor: 'status',
    width: '1fr',
    minWidth: 150,
    renderCell: createDataCellOther('status'),
  },
];

export const TableExampleActiveRowWithNumbering = () => {
  const onRowClick = useAction(onRowClickAction);
  const onRowMouseEnter = useAction(onRowMouseEnterAction);
  const onRowMouseLeave = useAction(onRowMouseLeaveAction);
  const [rows] = useAtom(rowsAtom);

  return (
    <Example col={1}>
      <Table
        rows={rows}
        columns={columns}
        zebraStriped
        onRowClick={onRowClick}
        onRowMouseEnter={onRowMouseEnter}
        onRowMouseLeave={onRowMouseLeave}
      />
    </Example>
  );
};
