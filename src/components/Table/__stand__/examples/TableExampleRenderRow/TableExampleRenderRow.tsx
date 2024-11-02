import { AnimateIconSwitcherProvider } from '@consta/icons/AnimateIconSwitcherProvider';
import { IconArrowRight } from '@consta/icons/IconArrowRight';
import { withAnimateSwitcherHOC } from '@consta/icons/withAnimateSwitcherHOC';
import { Example } from '@consta/stand';
import { Button } from '@consta/uikit/Button';
import { Grid, GridItem } from '@consta/uikit/Grid';
import { cnMixSpace } from '@consta/uikit/MixSpace';
import { Text } from '@consta/uikit/Text';
import { useMutableRef } from '@consta/uikit/useMutableRef';
import React, { useCallback, useMemo, useState } from 'react';

import { DataCell } from '##/components/DataCell';
import { Table, TableColumn, TableRenderCell } from '##/components/Table';

const IconArrow = withAnimateSwitcherHOC({
  startIcon: IconArrowRight,
  startDirection: 0,
  endDirection: 90,
});

type Option = { label: string; value: string };
type Options = { label: string; value: Option[] };

type Item = {
  id: number;
  label: string;
  formula: string;
  type: string;
};

type ItemInfo = {
  isInfo: number;
  options: Options[];
};

type Row = {
  id?: number;
  label?: string;
  formula?: string;
  type?: string;
  status?: 'work' | 'problem' | 'wait' | 'success';
  isInfo?: number;
  options?: Options[];
};

const data: Row[] = [
  {
    id: 1,
    label: 'Запись инклинометрии',
    formula: 'Время замера * Количество',
    type: 'Кондуктор',
  },
  {
    isInfo: 1,
    options: [
      {
        label: 'Порты',
        value: [
          { label: 'Входяший', value: 'A2-папа' },
          { label: 'Исходяший', value: 'A2-папа' },
        ],
      },
      {
        label: 'Размеры',
        value: [
          { label: 'ширина(мм)', value: '60' },
          { label: 'длинна(мм)', value: '80' },
        ],
      },
    ],
  },
  {
    id: 2,
    label: 'Шаблонирование при бурении',
    formula: 'Интервал/Скорость СПО',
    type: 'Труба бурильная',
  },
  {
    isInfo: 2,
    options: [
      {
        label: 'Диаметры',
        value: [
          { label: 'Внешний', value: '14.7' },
          { label: 'Внутренний', value: '12.7' },
        ],
      },
      {
        label: 'Нагрузка и моменты',
        value: [
          { label: 'Растягивающая нагрузка тела трубы, кН', value: '30' },
          { label: 'Допустимый момент на кручение ЗС,кН*м', value: '10' },
          {
            label: 'Допустимый момент на кручение тела трубы, кН*м',
            value: '10',
          },
          {
            label: 'Рекомендуемый момент свинчивания, кН*м',
            value: '10',
          },
        ],
      },
    ],
  },
];

const isItemInfo = (arg: Row): arg is ItemInfo =>
  Object.prototype.hasOwnProperty.call(arg, 'isInfo');

const isItem = (arg: Row): arg is Item =>
  Object.prototype.hasOwnProperty.call(arg, 'id');

const LabelCell = (props: {
  id: number;
  label: string;
  opened: boolean | undefined;
  toggle: (idx: number) => void;
}) => {
  const { id, opened, toggle, label } = props;

  return (
    <AnimateIconSwitcherProvider active={opened}>
      <DataCell
        control={
          <Button
            size="s"
            view="clear"
            iconLeft={IconArrow}
            onlyIcon
            onClick={() => toggle(id)}
          />
        }
      >
        {label}
      </DataCell>
    </AnimateIconSwitcherProvider>
  );
};

const InfoCell = (props: { options: Options[] }) => {
  const { options } = props;
  return (
    <Grid className={cnMixSpace({ p: 's' })} cols={4} gap="s">
      {options.map((opt) => {
        return (
          <>
            <GridItem col={4}>
              <Text weight="semibold">{opt.label}</Text>
            </GridItem>
            {opt.value.map((val) => (
              <GridItem>
                <Text>{val.value}</Text>
                <Text size="s" view="secondary">
                  {val.label}
                </Text>
              </GridItem>
            ))}
          </>
        );
      })}
    </Grid>
  );
};

export const TableExampleRenderRow = () => {
  const [openedList, setOpenedList] = useState<number[]>([]);

  const openedListRef = useMutableRef(openedList);

  const rows = useMemo(() => {
    return data.filter(
      (dataItem) =>
        Object.prototype.hasOwnProperty.call(dataItem, 'id') ||
        (isItemInfo(dataItem) &&
          openedList.findIndex(
            (openedListItem) => openedListItem === dataItem.isInfo,
          ) !== -1),
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

  const renderLabelCell: TableRenderCell<Row> = useCallback(({ row }) => {
    if (isItem(row)) {
      return (
        <LabelCell
          id={row.id}
          label={row.label}
          opened={openedListRef.current.findIndex((id) => id === row.id) !== -1}
          toggle={toggle}
        />
      );
    }
    if (isItemInfo(row)) {
      return <InfoCell options={row.options} />;
    }
    return null;
  }, []);

  const columns: TableColumn<Row>[] = useMemo(
    () => [
      {
        title: 'Название',
        accessor: 'label',
        renderCell: renderLabelCell,
        colSpan: ({ row }) => (isItemInfo(row) ? 'end' : 1),
        minWidth: 300,
      },
      {
        title: 'Формула',
        accessor: 'formula',
        minWidth: 200,
      },
      {
        title: 'Тип',
        accessor: 'type',
        minWidth: 180,
      },
    ],
    [],
  );

  return (
    <Example col={1}>
      <Table
        style={{ maxHeight: 500 }}
        rows={rows}
        columns={columns}
        stickyHeader
        getRowKey={(row) => {
          if (isItemInfo(row)) {
            return `${row.isInfo}-info`;
          }
          if (isItem(row)) {
            return `${row.id}`;
          }
          return '';
        }}
      />
    </Example>
  );
};
