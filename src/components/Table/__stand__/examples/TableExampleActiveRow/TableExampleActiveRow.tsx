import { Example } from '@consta/stand';
import { Checkbox } from '@consta/uikit/Checkbox';
import { Atom, atom } from '@reatom/core';
import { useAction, useAtom } from '@reatom/react';
import React from 'react';

import { DataCell } from '##/components/DataCell';
import { Table, TableColumn, TableRenderCell } from '##/components/Table';

type ROW = {
  id: number;
  name: string;
  profession: string;
  status: string;
};

const activeIdsAtom = atom<Record<ROW['id'], Atom<boolean>>>({});

const DataCellName: TableRenderCell<ROW> = (props) => {
  const [active] = useAtom(() => {
    const activeAtom = activeIdsAtom()[props.row.id];
    return activeAtom ? activeAtom() : false;
  });

  const onChange = useAction(() => {
    const activeIds = activeIdsAtom();
    const activeAtom = activeIdsAtom()[props.row.id];

    if (activeAtom) {
      activeAtom.set(!activeAtom());
    } else {
      activeIdsAtom.set({ ...activeIds, [props.row.id]: atom(true) });
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
