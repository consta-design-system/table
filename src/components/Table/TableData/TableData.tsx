import './TableData.css';

import { useAtom } from '@reatom/npm-react';
import React, { forwardRef } from 'react';

import { cn } from '##/utils/bem';
import { isNotNil } from '##/utils/type-guards';

import { TableRow } from '../TableRow';
import {
  TableDataComponent,
  TableDataProps,
  TableDefaultRow,
  TableRowMouseEvent,
} from '../types';

export const cnTableData = cn('TableData');

const getRowMouseEvent = (
  row: TableDefaultRow,
  fn?: TableRowMouseEvent<TableDefaultRow>,
) =>
  fn
    ? (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => fn(row, { e })
    : undefined;

const getKey = (
  row: TableDefaultRow,
  getRowKey: ((row: TableDefaultRow) => string | number) | undefined,
  rowIndex: number,
) => {
  const key = getRowKey?.(row);
  if (isNotNil(key)) {
    return key;
  }
  if (typeof row.id === 'string' || typeof row.id === 'number') {
    return row.id;
  }
  return rowIndex;
};

const TableDataRender = (
  props: TableDataProps,
  ref: React.Ref<HTMLDivElement>,
) => {
  const {
    className,
    rows,
    lowHeadersAtom,
    rowsRefsAtom,
    sliceAtom,
    zebraStriped = false,
    onRowMouseEnter,
    onRowMouseLeave,
    onRowClick,
    getRowKey,
    tableRef,
    rowHoverEffect,
    leftNoVisibleItemsAtom,
    rightNoVisibleItemsAtom,
    borderBetweenColumns,
    borderBetweenRows,
    ...otherProps
  } = props;

  const [rowsRefs] = useAtom(rowsRefsAtom);
  const [slice] = useAtom(sliceAtom);

  return (
    <div
      {...otherProps}
      ref={ref}
      className={cnTableData({ rowHoverEffect }, [className])}
    >
      {rows.slice(...slice).map((row, index) => {
        const rowIndex = index + slice[0];
        const rowZebraStriped = zebraStriped && rowIndex % 2 !== 0;

        return (
          <TableRow
            key={getKey(row, getRowKey, rowIndex)}
            row={row}
            index={rowIndex}
            lowHeadersAtom={lowHeadersAtom}
            zebraStriped={rowZebraStriped}
            onMouseEnter={getRowMouseEvent(row, onRowMouseEnter)}
            onMouseLeave={getRowMouseEvent(row, onRowMouseLeave)}
            onClick={getRowMouseEvent(row, onRowClick)}
            tableRef={tableRef}
            ref={rowsRefs[rowIndex]}
            leftNoVisibleItemsAtom={leftNoVisibleItemsAtom}
            rightNoVisibleItemsAtom={rightNoVisibleItemsAtom}
            borderBetweenColumns={borderBetweenColumns}
            borderBetweenRows={borderBetweenRows}
          />
        );
      })}
    </div>
  );
};

export const TableData = forwardRef(TableDataRender) as TableDataComponent;
