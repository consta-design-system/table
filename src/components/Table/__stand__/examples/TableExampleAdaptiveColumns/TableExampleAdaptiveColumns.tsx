import { Example } from '@consta/stand';
import { Button } from '@consta/uikit/Button';
import { getLastPoint, useBreakpoints } from '@consta/uikit/useBreakpoints';
import React, { useCallback, useMemo, useRef, useState } from 'react';

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
  's' | 'm' | 'l',
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
  l: {
    name: {
      width: 150,
      minWidth: 150,
      maxWidth: 150,
    },
    profession: {
      width: '1fr',
    },
    status: {
      width: 150,
      minWidth: 150,
      maxWidth: 150,
    },
  },
};

const breakpointsMap = { s: 300, m: 500, l: 760 };
const breakpointsSequence: (keyof typeof breakpointsMap)[] = ['s', 'm', 'l'];

export const TableExampleAdaptiveColumns = () => {
  const [widthSequence, setWidthSequence] = useState(0);

  const handleWidthChange = useCallback(() => {
    setWidthSequence((state) => {
      const newState = state + 1;
      return newState >= breakpointsSequence.length ? 0 : newState;
    });
  }, []);

  const tableRef = useRef<HTMLDivElement>(null);

  const point =
    getLastPoint(
      useBreakpoints({
        ref: tableRef,
        map: breakpointsMap,
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
        style={{
          outline: '1px solid red',
          width: breakpointsMap[breakpointsSequence[widthSequence]],
        }}
        rows={rows}
        columns={columns}
      />
      <Button onClick={handleWidthChange} label="Изменить ширину" />
    </Example>
  );
};
