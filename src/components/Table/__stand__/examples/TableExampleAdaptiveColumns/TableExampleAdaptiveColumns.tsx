import { Example } from '@consta/stand';
import { Button } from '@consta/uikit/Button';
import { getLastPoint, useBreakpoints } from '@consta/uikit/useBreakpoints';
import { useFlag } from '@consta/uikit/useFlag';
import React, { useMemo, useRef } from 'react';

import { Table, TableColumn } from '../../..';

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
];

const columnsWidthMap: Record<
  's' | 'm',
  Record<'name' | 'profession' | 'status', TableColumn<Row>>
> = {
  s: {
    name: {
      width: 100,
      minWidth: 100,
      maxWidth: 100,
    },
    profession: {
      width: '1fr',
      minWidth: 150,
    },
    status: {
      width: 120,
      minWidth: 120,
      maxWidth: 120,
    },
  },
  m: {
    name: {
      width: 120,
      minWidth: 120,
      maxWidth: 120,
    },
    profession: {
      width: '1fr',
      minWidth: 250,
    },
    status: {
      width: 120,
      minWidth: 120,
      maxWidth: 120,
    },
  },
};

export const TableExampleAdaptiveColumns = () => {
  const [isWide, setIsWide] = useFlag(true);

  const tableRef = useRef<HTMLDivElement>(null);

  const point =
    getLastPoint(
      useBreakpoints({
        ref: tableRef,
        map: { s: 190, m: 490 },
        isActive: true,
      }),
    ) || 's';

  const columns: TableColumn<Row>[] = useMemo(
    () => [
      {
        title: 'Имя',
        accessor: 'name',
        ...columnsWidthMap[point].name,
      },
      {
        title: 'Профессия',
        accessor: 'profession',
        ...columnsWidthMap[point].profession,
      },
      {
        title: 'Статус',
        accessor: 'status',
        ...columnsWidthMap[point].status,
      },
    ],
    [point],
  );

  return (
    <Example col={1}>
      <Table
        ref={tableRef}
        style={{ outline: '1px solid red', width: isWide ? 500 : 200 }}
        rows={rows}
        columns={columns}
      />
      <Button onClick={setIsWide.toggle} label="Изменить ширину" />
    </Example>
  );
};
