import { Example } from '@consta/stand';
import { Checkbox } from '@consta/uikit/Checkbox';
import { abortVar, action, atom, computed } from '@reatom/core';
import { reatomFactoryComponent } from '@reatom/react';
import React from 'react';

import { DataCell } from '##/components/DataCell';
import {
  getMergeRowsIndexs,
  Table,
  TableColumn,
  TableRenderCell,
  TableRenderHeaderCell,
} from '##/components/Table';
import rows from '##/components/Table/__mocks__/olympic-winners.json';

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

const checkedRowsAtom = atom<Record<string, boolean>>({});
const rowsAtom = atom<ROW[]>(
  rows.sort((a, b) => a.athlete.localeCompare(b.athlete)),
);

const YearCell = reatomFactoryComponent(
  (props: { row: ROW; rowIndex: number }) => {
    const { rowIndex } = props;
    const checkedAtom = computed(() => Boolean(checkedRowsAtom()[rowIndex]));

    return ({ row }) => (
      <DataCell data-row-active={checkedAtom()}>{row.year}</DataCell>
    );
  },
);

const CheckboxCell: TableRenderCell<ROW> = reatomFactoryComponent((props) => {
  const { rowIndex } = props;
  const checkedAtom = computed(() => Boolean(checkedRowsAtom()[rowIndex]));

  const onCheck = action(() => {
    const indexs = getMergeRowsIndexs(
      rowIndex,
      rowsAtom(),
      ({ athlete }) => `${athlete}`,
    );

    const newValue = { ...checkedRowsAtom() };

    indexs.forEach((v) => {
      newValue[v] = !newValue[v];
    });

    checkedRowsAtom.set(newValue);
  });

  return ({ row }) => (
    <DataCell control={<Checkbox checked={checkedAtom()} onChange={onCheck} />}>
      {row.athlete || 'without a name'}
    </DataCell>
  );
});

const CheckboxHeaderCell: TableRenderHeaderCell = reatomFactoryComponent(() => {
  const checkedLengthAtom = computed(() => {
    return Object.values(checkedRowsAtom()).filter(Boolean).length;
  });

  const intermediateAtom = computed(() => {
    if (
      checkedLengthAtom() === 0 ||
      checkedLengthAtom() === rowsAtom().length
    ) {
      return false;
    }

    return true;
  });

  const checkedAtom = computed(() => !!checkedLengthAtom());

  const onCheck = action(() => {
    const newValue = checkedLengthAtom() !== rowsAtom().length;

    checkedRowsAtom.set(
      rowsAtom().reduce(
        (acc, _, index) => {
          acc[index] = newValue;
          return acc;
        },
        {} as Record<string, boolean>,
      ),
    );
  });

  return () => {
    return (
      <DataCell
        control={
          <Checkbox
            checked={checkedAtom()}
            onChange={onCheck}
            intermediate={intermediateAtom()}
          />
        }
      />
    );
  };
});

const columnsAtom = atom<TableColumn<ROW>[]>([
  {
    title: 'Checkbox',
    accessor: 'checkbox',
    colSpan: () => 2,
    mergeCells: ({ row }) => `${row.athlete}`,
    renderHeaderCell: CheckboxHeaderCell,
    renderCell: CheckboxCell,
    minWidth: 56,
    maxWidth: 56,
  },
  {
    title: 'Имя',
    accessor: 'athlete',
    minWidth: 200,
  },
  {
    title: 'Страна',
    accessor: 'country',
    minWidth: 100,
    mergeCells: ({ row: { country, athlete } }) => `${country}-${athlete}`,
  },
  {
    title: 'Год',
    accessor: 'year',
    minWidth: 66,
    maxWidth: 66,
    renderCell: YearCell,
  },
  {
    title: 'Медали',
    accessor: 'year',
    columns: [
      {
        title: 'Золото',
        accessor: 'gold',
        minWidth: 96,
        maxWidth: 96,
      },
      {
        title: 'Серебро',
        accessor: 'silver',
        minWidth: 96,
        maxWidth: 96,
      },
      {
        title: 'Бронза',
        accessor: 'bronze',
        minWidth: 96,
        maxWidth: 96,
      },
    ],
  },
]);

export const TableExampleMergeCellsActivated = reatomFactoryComponent(() => {
  abortVar.subscribe(() => checkedRowsAtom.set({}));

  return () => (
    <Example col={1}>
      <div>
        <Table
          style={{ maxHeight: 600 }}
          rows={rowsAtom()}
          columns={columnsAtom()}
          stickyHeader
          virtualScroll
        />
      </div>
    </Example>
  );
});
