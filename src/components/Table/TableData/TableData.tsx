import './TableData.css';

import React, { forwardRef } from 'react';

import { DataCell } from '##/components/DataCell';
import { cn } from '##/utils/bem';
import { isNotNil, isNumber, isString } from '##/utils/type-guards';

import { cnTableCell } from '../TableCell';
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
    ...otherProps
  } = props;

  return (
    <div {...otherProps} ref={ref} className={cnTableData(null, [className])}>
      {rows.slice(...slice).map((row, index) => {
        const rowIndex = index + slice[0];
        const rowKey = getKey(row, getRowKey, rowIndex);
        const rowZebraStriped = zebraStriped && rowIndex % 2 !== 0;
        let miss = 0;

        return (
          <div
            className={cnTableData('Row')}
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
                  <div
                    key={`${rowKey}-${accessor || columnIndex}`}
                    ref={columnIndex === 0 ? rowsRefs[rowIndex] : undefined}
                    className={cnTableData('Cell', { pinned: !!pinned }, [
                      cnTableCell({
                        separator: isSeparator,
                        borderLeft:
                          columnIndex !== 0 &&
                          !(
                            pinned !== 'left' &&
                            lowHeaders[columnIndex - 1]?.pinned === 'left'
                          ),
                        borderRight:
                          pinned === 'left' &&
                          lowHeaders[columnIndex + 1]?.pinned !== 'left',
                        borderTop: !isSeparator && rowIndex !== 0,
                        sticky: !!pinned,
                        zebraStriped: rowZebraStriped,
                      }),
                    ])}
                    style={{
                      ['--table-cell-col-span' as string]:
                        miss > 0 ? miss + 1 : undefined,
                      left:
                        pinned === 'left'
                          ? `var(--table-column-sticky-left-offset-${columnIndex})`
                          : undefined,
                      right:
                        pinned === 'right'
                          ? `var(--table-column-sticky-right-offset-${columnIndex})`
                          : undefined,
                    }}
                  >
                    {typeof RenderCell === 'function' ? (
                      <RenderCell
                        row={row}
                        rowIndex={rowIndex}
                        columnIndex={columnIndex}
                      />
                    ) : (
                      getCellDataByAccessor(row, accessor, isSeparator)
                    )}
                  </div>
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
