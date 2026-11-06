import { Example } from '@consta/stand';
import { action, Atom, atom, BooleanAtom, reatomBoolean } from '@reatom/core';
import { useAction, useAtom } from '@reatom/react';
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
  hover: BooleanAtom;
  active: BooleanAtom;
};

const rowsAtom = atom<Atom<ROW>[]>([
  atom({
    id: 1,
    name: 'Антон Григорьев',
    profession: 'Строитель, который построил дом',
    status: 'недоступен',
    hover: reatomBoolean(),
    active: reatomBoolean(),
  }),
  atom({
    id: 2,
    name: 'Василий Пупкин',
    profession: 'Отвечает на вопросы, хотя его не спросили',
    status: 'на связи',
    hover: reatomBoolean(),
    active: reatomBoolean(),
  }),
]);

const onRowClickAction = action<[Atom<ROW>]>((rowAtom) =>
  rowAtom().active.toggle(),
);

const onRowMouseEnterAction = action<[Atom<ROW>]>((rowAtom) =>
  rowAtom().hover.setTrue(),
);

const onRowMouseLeaveAction = action<[Atom<ROW>]>((rowAtom) =>
  rowAtom().hover.setFalse(),
);

const DataCellName: TableRenderCell<Atom<ROW>> = (props) => {
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
  const Component: TableRenderCell<Atom<ROW>> = (props) => {
    const [row] = useAtom(props.row);

    return <DataCell>{row[accessor]}</DataCell>;
  };

  return Component;
};

const columns: TableColumn<Atom<ROW>>[] = [
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
