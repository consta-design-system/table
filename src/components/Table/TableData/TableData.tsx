import './TableData.css';

import { factoryComponent } from '@consta/uikit/__internal__/src/utils/state';
import React from 'react';

import { cn } from '##/utils/bem';
import { isNotNil } from '##/utils/type-guards';

import { TableRow } from '../TableRow';
import { TableDataComponent, TableRowMouseEvent } from '../types';

export const cnTableData = cn('TableData');

const getRowMouseEvent = <ROW,>(row: ROW, fn?: TableRowMouseEvent<ROW>) =>
  fn
    ? (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => fn(row, { e })
    : undefined;

const getKey = <ROW,>(
  row: ROW,
  getRowKey: ((row: ROW) => string | number) | undefined,
  rowIndex: number,
) => {
  const key = getRowKey?.(row);
  if (isNotNil(key)) {
    return key;
  }
  if (
    typeof row === 'object' &&
    isNotNil(row) &&
    'id' in row &&
    (typeof row.id === 'string' || typeof row.id === 'number')
  ) {
    return row.id;
  }
  return rowIndex;
};

export const TableData: TableDataComponent = factoryComponent(() => {
  return ({
    className,
    rows,
    lowHeadersAtom,
    rowsElementsAtom,
    sliceAtom,
    zebraStriped = false,
    onRowMouseEnter,
    onRowMouseLeave,
    onRowClick,
    getRowKey,
    tableElementAtom,
    rowHoverEffect,
    leftNoVisibleItemsAtom,
    rightNoVisibleItemsAtom,
    ...otherProps
  }) => {
    const rowsElements = rowsElementsAtom();
    const slice = sliceAtom();

    return (
      <div
        {...otherProps}
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
              tableElementAtom={tableElementAtom}
              ref={rowsElements[rowIndex].set}
              leftNoVisibleItemsAtom={leftNoVisibleItemsAtom}
              rightNoVisibleItemsAtom={rightNoVisibleItemsAtom}
            />
          );
        })}
      </div>
    );
  };
});
