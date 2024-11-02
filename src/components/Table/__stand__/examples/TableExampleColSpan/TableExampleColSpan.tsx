import { AnimateIconSwitcherProvider } from '@consta/icons/AnimateIconSwitcherProvider';
import { IconArrowRight } from '@consta/icons/IconArrowRight';
import { withAnimateSwitcherHOC } from '@consta/icons/withAnimateSwitcherHOC';
import { Example } from '@consta/stand';
import { Button } from '@consta/uikit/Button';
import { useMutableRef } from '@consta/uikit/useMutableRef';
import React, { useCallback, useMemo, useState } from 'react';

import { DataCell } from '##/components/DataCell';
import { Table, TableColumn, TableRenderCell } from '##/components/Table';

const IconArrow = withAnimateSwitcherHOC({
  startIcon: IconArrowRight,
  startDirection: 0,
  endDirection: 90,
});

type HUMAN = {
  name: string;
  age: number;
  street: string;
  building: number;
  number: number;
  gender: string;
  district: string;
};

type GROUP = {
  district: string;
  name: undefined;
  age: undefined;
  street: undefined;
  building: undefined;
  number: undefined;
  gender: undefined;
};

const data: (HUMAN | GROUP)[] = [
  {
    name: undefined,
    age: undefined,
    street: undefined,
    building: undefined,
    number: undefined,
    gender: undefined,
    district: 'Ленинский район',
  },
  {
    name: 'Иван',
    street: 'ул. Мира',
    building: 1,
    age: 32,
    number: 2033,
    gender: 'муж.',
    district: 'Ленинский район',
  },
  {
    name: 'Анна',
    age: 40,
    street: 'пл. Ленина',
    building: 3,
    number: 2035,
    gender: 'жен.',
    district: 'Ленинский район',
  },
];

const DataCellGroup = (props: {
  district: string;
  opened: boolean | undefined;
  toggle: (idx: string) => void;
}) => {
  const { district, opened, toggle } = props;

  return (
    <AnimateIconSwitcherProvider active={opened}>
      <DataCell
        control={
          <Button
            size="s"
            view="clear"
            iconLeft={IconArrow}
            onlyIcon
            onClick={() => toggle(district)}
          />
        }
      >
        Граждане
      </DataCell>
    </AnimateIconSwitcherProvider>
  );
};

export const TableExampleColSpan = () => {
  const [openedList, setOpenedList] = useState<string[]>([]);

  const openedListRef = useMutableRef(openedList);

  const rows = useMemo(() => {
    return data.filter(
      (dataItem) =>
        dataItem.name === undefined ||
        openedList.findIndex(
          (openedListItem) => openedListItem === dataItem.district,
        ) !== -1,
    );
  }, [openedList]);

  const toggle = useCallback((idx: string) => {
    setOpenedList((state) => {
      const open = state.findIndex((value) => value === idx) !== -1;
      if (open) {
        return state.filter((value) => value !== idx);
      }
      return [...state, idx];
    });
  }, []);

  const renderNameCell: TableRenderCell<HUMAN | GROUP> = useCallback(
    (props) =>
      props.row.name ? (
        <DataCell>{props.row.name}</DataCell>
      ) : (
        <DataCellGroup
          toggle={toggle}
          district={props.row.district}
          opened={
            openedListRef.current.findIndex(
              (item) => item === props.row.district,
            ) !== -1
          }
        />
      ),
    [],
  );

  const renderStreetCell: TableRenderCell<HUMAN | GROUP> = useCallback(
    (props) =>
      props.row.street ? (
        <DataCell>{props.row.street}</DataCell>
      ) : (
        <DataCell>{props.row.district}</DataCell>
      ),
    [],
  );

  const columns: TableColumn<GROUP | HUMAN>[] = useMemo(
    () => [
      {
        title: 'Имя',
        accessor: 'name',
        width: 150,
        renderCell: renderNameCell,
        colSpan: ({ row }) => (row.name ? 1 : 2),
        minWidth: 100,
      },
      {
        title: 'Возраст',
        accessor: 'age',
        minWidth: 100,
      },
      {
        title: 'Адрес',
        columns: [
          {
            title: 'Улица',
            accessor: 'street',
            renderCell: renderStreetCell,
            colSpan: ({ row }) => (row.street ? 1 : 3),
            minWidth: 100,
          },
          {
            title: 'Дом',
            accessor: 'building',
            minWidth: 100,
          },
          {
            title: 'Квартира',
            accessor: 'number',
            minWidth: 100,
          },
        ],
      },
      {
        title: 'Пол',
        accessor: 'gender',
        minWidth: 80,
      },
    ],
    [],
  );

  return (
    <Example col={1}>
      <Table
        style={{ maxHeight: 400 }}
        rows={rows}
        columns={columns}
        stickyHeader
        zebraStriped
        getRowKey={(row) => row.district + row.name + row.age}
      />
    </Example>
  );
};
