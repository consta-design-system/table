import { IconFunnel } from '@consta/icons/IconFunnel';
import { IconKebab } from '@consta/icons/IconKebab';
import { IconUnsort } from '@consta/icons/IconUnsort';
import { useBoolean, useSelect } from '@consta/stand';
import { Button } from '@consta/uikit/Button';
import { Checkbox } from '@consta/uikit/Checkbox';
import { useFlag } from '@consta/uikit/useFlag';
import React, { useMemo } from 'react';

import { DataCell } from '##/components/DataCell';
import { HeaderDataCell } from '##/components/HeaderDataCell';

import { Table, TableColumn } from '..';
import data from '../__mocks__/olympic-winners.json';

const AthleteHeaderCell = (props: { title?: string; size: 'm' | 's' }) => {
  const { title, size } = props;

  const [checked, setChecked] = useFlag();

  const buttonSize = size === 'm' ? 's' : 'xs';

  return (
    <HeaderDataCell
      size={size}
      controlLeft={
        <Checkbox checked={checked} onChange={setChecked.toggle} size={size} />
      }
      controlRight={[
        <Button
          size={buttonSize}
          view="clear"
          iconLeft={IconUnsort}
          onlyIcon
        />,
        <Button
          size={buttonSize}
          view="clear"
          iconLeft={IconFunnel}
          onlyIcon
        />,
        <Button size={buttonSize} view="clear" iconLeft={IconKebab} onlyIcon />,
      ]}
    >
      {title}
    </HeaderDataCell>
  );
};

const AthleteDataCell = (props: {
  row: { athlete: string };
  size: 'm' | 's';
  truncate: boolean;
}) => {
  const {
    row: { athlete },
    size,
    truncate,
  } = props;

  const [checked, setChecked] = useFlag();

  return (
    <DataCell
      size={size}
      control={
        <Checkbox checked={checked} onChange={setChecked.toggle} size={size} />
      }
      truncate={truncate}
    >
      {athlete}
    </DataCell>
  );
};

const OtherCell = (props: {
  title: string | number | null;
  size: 'm' | 's';
  truncate: boolean;
}) => {
  const { title, size, truncate } = props;
  return (
    <DataCell truncate={truncate} size={size}>
      {title}
    </DataCell>
  );
};

const OtherHeaderCell = (props: {
  title: string | number | undefined;
  size: 'm' | 's';
}) => {
  const { title, size } = props;
  return <HeaderDataCell size={size}>{title}</HeaderDataCell>;
};

type Row = {
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

const virtualScrollMap: {
  'Горизонтальный': [true, false];
  'Вертикальный': [false, true];
  'Горизонтальный и вертикальный': true;
  'Отключен': false;
} = {
  'Горизонтальный': [true, false],
  'Вертикальный': [false, true],
  'Горизонтальный и вертикальный': true,
  'Отключен': false,
};

const Variants = () => {
  const size = useSelect('size', ['m', 's'], 'm') || 'm';
  const stickyHeader = useBoolean('stickyHeader');
  const virtualScroll = useSelect(
    'virtualScroll',
    [
      'Горизонтальный',
      'Вертикальный',
      'Горизонтальный и вертикальный',
      'Отключен',
    ],
    'Горизонтальный и вертикальный',
  );
  const zebraStriped = useBoolean('zebraStriped');
  const resizable = useSelect('resizable', ['outside', 'inside']);
  const withRenderCell = useBoolean('withRenderCell');
  const withRenderHeaderCell = useBoolean('withRenderHeaderCell');
  const borderBetweenColumns = useBoolean('borderBetweenColumns', true);
  const borderBetweenRows = useBoolean('borderBetweenRows', true);

  const virtualScrollProp = virtualScroll
    ? virtualScrollMap[virtualScroll]
    : false;

  const horizontalVirtualScroll = Array.isArray(virtualScrollProp)
    ? virtualScrollProp[0]
    : virtualScrollProp;

  const verticalVirtualScroll = Array.isArray(virtualScrollProp)
    ? virtualScrollProp[1]
    : virtualScrollProp;

  const columns: TableColumn<Row>[] = useMemo(
    () => [
      {
        title: 'Имя',
        accessor: 'athlete',
        minWidth: 160,
        width: 200,
        renderCell: withRenderCell
          ? (props) => (
              <AthleteDataCell
                {...props}
                size={size}
                truncate={horizontalVirtualScroll}
              />
            )
          : (props) => (
              <OtherCell
                title={props.row.athlete}
                size={size}
                truncate={horizontalVirtualScroll}
              />
            ),
        renderHeaderCell: withRenderHeaderCell
          ? (props) => <AthleteHeaderCell {...props} size={size} />
          : (props) => <OtherHeaderCell title={props.title} size={size} />,
      },
      {
        title: 'Страна',
        accessor: 'country',
        width: 'auto',
        minWidth: 140,
        renderCell: (props) => (
          <OtherCell
            title={props.row.country}
            size={size}
            truncate={horizontalVirtualScroll}
          />
        ),
        renderHeaderCell: (props) => (
          <OtherHeaderCell title={props.title} size={size} />
        ),
      },
      {
        title: 'Возраст',
        accessor: 'age',
        minWidth: 100,
        renderCell: (props) => (
          <OtherCell
            title={props.row.age}
            size={size}
            truncate={horizontalVirtualScroll}
          />
        ),
        renderHeaderCell: (props) => (
          <OtherHeaderCell title={props.title} size={size} />
        ),
      },
      {
        title: 'Год',
        accessor: 'year',
        minWidth: 100,
        renderCell: (props) => (
          <OtherCell
            title={props.row.year}
            size={size}
            truncate={horizontalVirtualScroll}
          />
        ),
        renderHeaderCell: (props) => (
          <OtherHeaderCell title={props.title} size={size} />
        ),
      },
      {
        title: 'Sport',
        accessor: 'sport',
        minWidth: 150,
        renderCell: (props) => (
          <OtherCell
            title={props.row.sport}
            size={size}
            truncate={horizontalVirtualScroll}
          />
        ),
        renderHeaderCell: (props) => (
          <OtherHeaderCell title={props.title} size={size} />
        ),
      },
      {
        title: 'Медали',
        accessor: 'medals',
        renderHeaderCell: (props) => (
          <OtherHeaderCell title={props.title} size={size} />
        ),
        columns: [
          {
            title: 'Золото',
            accessor: 'gold',
            minWidth: 100,
            width: 100,
            renderCell: (props) => (
              <OtherCell
                title={props.row.gold || '-'}
                size={size}
                truncate={horizontalVirtualScroll}
              />
            ),
            renderHeaderCell: (props) => (
              <OtherHeaderCell title={props.title} size={size} />
            ),
          },
          {
            title: 'Серебро',
            accessor: 'silver',
            minWidth: 100,
            width: 100,
            renderCell: (props) => (
              <OtherCell
                title={props.row.silver || '-'}
                size={size}
                truncate={horizontalVirtualScroll}
              />
            ),
            renderHeaderCell: (props) => (
              <OtherHeaderCell title={props.title} size={size} />
            ),
          },
          {
            title: 'Бронза',
            accessor: 'bronze',
            minWidth: 100,
            width: 100,
            renderCell: (props) => (
              <OtherCell
                title={props.row.bronze || '-'}
                size={size}
                truncate={horizontalVirtualScroll}
              />
            ),
            renderHeaderCell: (props) => (
              <OtherHeaderCell title={props.title} size={size} />
            ),
          },
          {
            title: 'Всего',
            accessor: 'total',
            minWidth: 100,
            width: 100,
            renderCell: (props) => (
              <OtherCell
                title={props.row.total}
                size={size}
                truncate={horizontalVirtualScroll}
              />
            ),
            renderHeaderCell: (props) => (
              <OtherHeaderCell title={props.title} size={size} />
            ),
          },
        ],
      },
    ],
    [withRenderCell, withRenderHeaderCell, size, horizontalVirtualScroll],
  );

  const rows: Row[] = useMemo(
    () => (verticalVirtualScroll ? data : data.slice(0, 100)),
    [verticalVirtualScroll],
  );

  return (
    <div style={{ position: 'absolute', height: '100%', width: '100%' }}>
      <Table
        rows={rows}
        resizable={resizable}
        zebraStriped={zebraStriped}
        columns={columns}
        stickyHeader={stickyHeader}
        virtualScroll={virtualScrollProp}
        style={{ maxHeight: '100%' }}
        borderBetweenColumns={borderBetweenColumns}
        borderBetweenRows={borderBetweenRows}
      />
    </div>
  );
};

export default Variants;
