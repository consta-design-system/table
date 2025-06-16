import { Example } from '@consta/stand';
import { Text } from '@consta/uikit/Text';
import React, { useMemo, useState } from 'react';

import { Table, TableColumn } from '##/components/Table';
import data from '##/components/Table/__mocks__/olympic-winners.json';

type ROW = {
  athlete: string;
  age: number | null;
  country: string;
  year: number;
  date: string;
  sport: string;
  gold: number;
  silver: number;
  bronze: number;
  total: number;
};

const columns: TableColumn<ROW>[] = [
  {
    title: 'Атлет',
    accessor: 'athlete',
    minWidth: 200,
  },
  {
    title: 'Возраст',
    accessor: 'age',
    minWidth: 100,
  },
  {
    title: 'Страна',
    accessor: 'country',
    minWidth: 200,
  },
  {
    title: 'Год',
    accessor: 'year',
    minWidth: 70,
  },
  {
    title: 'Дата',
    accessor: 'date',
    minWidth: 120,
  },
  {
    title: 'Спорт',
    accessor: 'sport',
    minWidth: 250,
  },
  {
    title: 'Золото',
    accessor: 'gold',
    minWidth: 100,
  },
  {
    title: 'Серебро',
    accessor: 'silver',
    minWidth: 100,
  },
  {
    title: 'Бронза',
    accessor: 'bronze',
    minWidth: 100,
  },
  {
    title: 'Всего',
    accessor: 'total',
    minWidth: 100,
  },
];

export const TableExampleOnScrollToBottom = () => {
  const [isScrollToBottom, setIsScrollToBottom] = useState(false);
  const rows = useMemo(() => data.slice(0, 60), []);

  return (
    <Example col={1}>
      <Text size="m" weight="bold">
        {isScrollToBottom ? 'Вы проскроллилили до конца' : 'Скрольте вниз'}
      </Text>
      <Table
        style={{ maxHeight: 400 }}
        rows={rows}
        columns={columns}
        stickyHeader
        virtualScroll
        onScrollToBottom={() => setIsScrollToBottom(true)}
      />
    </Example>
  );
};
