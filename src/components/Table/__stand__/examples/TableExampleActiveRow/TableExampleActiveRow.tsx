import { Example } from '@consta/stand';
import { Checkbox } from '@consta/uikit/Checkbox';
import { atom, AtomMut } from '@reatom/core';
import { useAction, useAtom } from '@reatom/npm-react';
import React from 'react';

import { DataCell } from '##/components/DataCell';
import { Table, TableColumn, TableRenderCell } from '##/components/Table';

type ROW = {
  id: number;
  name: string;
  profession: string;
  status: string;
};

const activeIdsAtom = atom<Record<ROW['id'], AtomMut<boolean>>>({});

const DataCellName: TableRenderCell<ROW> = (props) => {
  const [active] = useAtom((ctx) => {
    const activeAtom = ctx.spy(activeIdsAtom)[props.row.id];
    return activeAtom ? ctx.spy(activeAtom) : false;
  });

  const onChange = useAction((ctx) => {
    const activeIds = ctx.get(activeIdsAtom);
    const activeAtom = ctx.get(activeIdsAtom)[props.row.id];

    if (activeAtom) {
      activeAtom(ctx, !ctx.get(activeAtom));
    } else {
      activeIdsAtom(ctx, { ...activeIds, [props.row.id]: atom(true) });
    }
  });

  return (
    <DataCell
      data-row-active={active}
      control={<Checkbox size="s" checked={active} onChange={onChange} />}
    >
      {props.row.name}
    </DataCell>
  );
};

const columns: TableColumn<ROW>[] = [
  {
    title: 'Имя',
    accessor: 'name',
    width: 240,
    renderCell: DataCellName,
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

export const TableExampleActiveRow = () => (
  <Example col={1}>
    <Table rows={rows} columns={columns} zebraStriped />
  </Example>
);
