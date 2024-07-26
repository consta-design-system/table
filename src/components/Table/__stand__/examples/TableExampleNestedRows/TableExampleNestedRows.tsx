import { AnimateIconSwitcherProvider } from '@consta/icons/AnimateIconSwitcherProvider';
import { IconArrowRight } from '@consta/icons/IconArrowRight';
import { withAnimateSwitcherHOC } from '@consta/icons/withAnimateSwitcherHOC';
import { Example } from '@consta/stand';
import { Button } from '@consta/uikit/Button';
import { useMutableRef } from '@consta/uikit/useMutableRef';
import React, { useCallback, useMemo, useState } from 'react';

import { DataCell } from '##/components/DataCell';
import { Table, TableColumn, TableRenderCell } from '##/components/Table';
import { range } from '##/utils/array';

type ROW = {
  idx: number;
  col1: string;
  col2: string;
  col3: string;
  parrent: number | undefined;
  level: number;
};

const IaconArrow = withAnimateSwitcherHOC({
  startIcon: IconArrowRight,
  startDirection: 0,
  endDirection: 90,
});

const getDataCell = (idx: number): ROW => {
  const parrent = Math.floor(idx / 10) * 10;

  return {
    idx,
    col1: `Данные 1 - ${idx}`,
    col2: `Данные 2 - ${idx}`,
    col3: `Данные 3 - ${idx}`,
    parrent: parrent === idx ? undefined : parrent,
    level: parrent === idx ? 0 : 1,
  };
};

const data = range(100000).map(getDataCell);

const DataCellCol1 = (props: {
  row: {
    col1: string;
    parrent: number | undefined;
    idx: number;
    level: number;
  };
  opened: boolean | undefined;
  toggle: (idx: number) => void;
}) => {
  const {
    row: { col1, parrent, idx, level },
    opened,
    toggle,
  } = props;

  return (
    <AnimateIconSwitcherProvider active={opened}>
      <DataCell
        level={level}
        control={
          typeof parrent === 'undefined' ? (
            <Button
              size="s"
              view="clear"
              iconLeft={IaconArrow}
              onlyIcon
              onClick={() => toggle(idx)}
            />
          ) : undefined
        }
      >
        {col1}
      </DataCell>
    </AnimateIconSwitcherProvider>
  );
};

export const TableExampleNestedRows = () => {
  const [openedList, setOpenedList] = useState<number[]>([]);

  const openedListRef = useMutableRef(openedList);

  const rows = useMemo(() => {
    return data.filter(
      (dataItem) =>
        dataItem.parrent === undefined ||
        openedList.findIndex(
          (openedListItem) => openedListItem === dataItem.parrent,
        ) !== -1,
    );
  }, [openedList]);

  const toggle = useCallback((idx: number) => {
    setOpenedList((state) => {
      const open = state.findIndex((value) => value === idx) !== -1;
      if (open) {
        return state.filter((value) => value !== idx);
      }
      return [...state, idx];
    });
  }, []);

  const renderCellCol1: TableRenderCell<ROW> = useCallback(
    (props) => (
      <DataCellCol1
        {...props}
        toggle={toggle}
        opened={
          openedListRef.current.findIndex((item) => item === props.row.idx) !==
          -1
        }
      />
    ),
    [],
  );

  const columns: TableColumn<ROW>[] = useMemo(
    () => [
      {
        title: 'Колонка - 1',
        accessor: 'col1',
        renderCell: renderCellCol1,
      },
      {
        title: 'Колонка - 2',
        accessor: 'col2',
      },
      {
        title: 'Колонка - 3',
        accessor: 'col3',
      },
    ],
    [],
  );

  return (
    <Example col={1}>
      <div>
        <Table
          style={{ maxHeight: 400 }}
          rows={rows}
          columns={columns}
          stickyHeader
          virtualScroll
        />
      </div>
    </Example>
  );
};
