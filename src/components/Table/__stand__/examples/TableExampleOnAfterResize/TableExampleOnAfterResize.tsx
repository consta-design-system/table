import { Example } from '@consta/stand';
import { Text } from '@consta/uikit/Text';
import React, { useCallback, useMemo, useState } from 'react';

import {
  Table,
  TableColumn,
  TableColumnResizeResult,
} from '##/components/Table';
import data from '##/components/Table/__mocks__/olympic-winners.json';

type ROW = {
  athlete: string;
  age: number | null;
  country: string;
  year: number;
  sport: string;
};

const baseColumns: TableColumn<ROW>[] = [
  {
    title: 'Атлет',
    accessor: 'athlete',
    width: 'auto',
    minWidth: 160,
  },
  {
    title: 'Возраст',
    accessor: 'age',
    width: 90,
    minWidth: 90,
  },
  {
    title: 'Страна',
    accessor: 'country',
    width: 'auto',
    minWidth: 160,
  },
  {
    title: 'Год',
    accessor: 'year',
    width: 100,
    minWidth: 100,
  },
  {
    title: 'Спорт',
    accessor: 'sport',
    width: 'auto',
    minWidth: 160,
  },
];

const applyWidths = (
  columns: TableColumn<ROW>[],
  widths: Record<string, number>,
): TableColumn<ROW>[] =>
  columns.map((column) => {
    const width = column.accessor && widths[column.accessor];
    return width ? { ...column, width } : column;
  });

export const TableExampleOnAfterResize = () => {
  const [widths, setWidths] = useState<Record<string, number>>({});

  const rows = useMemo(() => data.slice(0, 60), []);
  const columns = useMemo(() => applyWidths(baseColumns, widths), [widths]);

  const handleAfterResize = useCallback((result: TableColumnResizeResult[]) => {
    setWidths((state) => ({
      ...state,
      ...Object.fromEntries(
        result.map(({ accessor, width }) => [accessor, width]),
      ),
    }));
  }, []);

  return (
    <Example col={1}>
      <Text size="s" view="secondary">
        {Object.keys(widths).length
          ? `Сохранённая ширина колонок: ${JSON.stringify(widths)}`
          : 'Измените ширину любой колонки — итоговые значения появятся здесь и переживут пересоздание columns'}
      </Text>
      <Table
        style={{ maxHeight: 400 }}
        rows={rows}
        columns={columns}
        stickyHeader
        virtualScroll
        resizable="outside"
        zebraStriped
        onAfterResize={handleAfterResize}
      />
    </Example>
  );
};
