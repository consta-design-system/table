import './TableData.css';

import React, { forwardRef } from 'react';

import { DataCell } from '##/components/DataCell';
import { cn } from '##/utils/bem';
import { isNotNil, isNumber, isString } from '##/utils/type-guards';

import { TableDataCell } from '../TableDataCell';
import {
  TableDataComponent,
  TableDataProps,
  TableDefaultRow,
  TableRowMouseEvent,
} from '../types';

export const cnTableData = cn('TableData');

const getCellDataByAccessor = <T,>(
  row: T,
  accessor?: (keyof T extends string ? string & keyof T : never) | undefined,
  isSeparator?: boolean,
) => {
  if (isSeparator) {
    return '';
  }

  if (!accessor) {
    return '';
  }

  const data = row?.[accessor];

  if (isString(data) || isNumber(data)) {
    return <DataCell>{data.toString()}</DataCell>;
  }

  return '';
};

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

const getMiss = (
  colSpan: number | undefined | 'end',
  index: number,
  length: number,
  pinned: boolean,
) => {
  if (pinned) {
    return 0;
  }
  if (colSpan === 'end') {
    return length - index - 1;
  }
  if (typeof colSpan === 'number') {
    return colSpan - 1;
  }
  return 0;
};

const sliceMap = <T, T2>(
  array: T[],
  slice: [number, number],
  mapper: (item: T, index: number) => T2,
) => {
  const render = [];
  for (let index = slice[0]; index < slice[1]; index++) {
    render.push(mapper(array[index], index));
  }
  return render;
};

const TableDataRender = (
  props: TableDataProps,
  ref: React.Ref<HTMLDivElement>,
) => {
  const {
    className,
    rows,
    lowHeaders,
    rowsRefs,
    slice,
    zebraStriped = false,
    onRowMouseEnter,
    onRowMouseLeave,
    onRowClick,
    getRowKey,
    tableRef,
    rowHoverEffect,
    ...otherProps
  } = props;

  return (
    <div
      {...otherProps}
      ref={ref}
      className={cnTableData({ rowHoverEffect }, [className])}
    >
      {sliceMap(rows, slice, (row, rowIndex) => {
        // const rowIndex = index + slice[0
        const rowKey = getKey(row, getRowKey, rowIndex);
        const rowZebraStriped = zebraStriped && rowIndex % 2 !== 0;

        let miss = 0;

        return (
          <div
            className={cnTableData('Row', { zebraStriped: rowZebraStriped })}
            key={rowKey}
            onMouseEnter={getRowMouseEvent(row, onRowMouseEnter)}
            onMouseLeave={getRowMouseEvent(row, onRowMouseLeave)}
            onClick={getRowMouseEvent(row, onRowClick)}
            aria-hidden="true"
          >
            {lowHeaders.map(
              (
                {
                  isSeparator,
                  accessor,
                  pinned,
                  renderCell: RenderCell,
                  colSpan: getColSpan,
                },
                columnIndex,
              ) => {
                if (miss) {
                  miss = miss ? miss - 1 : miss;
                  return null;
                }

                const colSpan = getColSpan?.({
                  row,
                });

                miss = getMiss(
                  colSpan,
                  columnIndex,
                  lowHeaders.length,
                  !!pinned,
                );

                return (
                  <TableDataCell
                    key={`${rowKey}-${accessor || columnIndex}`}
                    ref={columnIndex === 0 ? rowsRefs[rowIndex] : undefined}
                    pinned={pinned}
                    isSeparator={isSeparator}
                    columnIndex={columnIndex}
                    borderLeft={
                      columnIndex !== 0 &&
                      !(
                        pinned !== 'left' &&
                        lowHeaders[columnIndex - 1]?.pinned === 'left'
                      )
                    }
                    borderRight={
                      pinned === 'left' &&
                      lowHeaders[columnIndex + 1]?.pinned !== 'left'
                    }
                    borderTop={!isSeparator && rowIndex !== 0}
                    colSpan={miss > 0 ? miss + 1 : undefined}
                    tableRef={tableRef}
                  >
                    {() => {
                      return isNotNil(RenderCell) ? (
                        <RenderCell
                          row={row}
                          rowIndex={rowIndex}
                          columnIndex={columnIndex}
                          tableRef={tableRef}
                        />
                      ) : (
                        getCellDataByAccessor(row, accessor, isSeparator)
                      );
                    }}
                  </TableDataCell>
                );
              },
            )}
          </div>
        );
      })}
    </div>
  );
};

export const TableData = forwardRef(TableDataRender) as TableDataComponent;
