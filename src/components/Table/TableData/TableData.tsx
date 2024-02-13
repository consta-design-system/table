import './TableData.css';

import React, { forwardRef } from 'react';

import { DataCell } from '##/components/DataCell';
import { cn } from '##/utils/bem';
import { isNumber, isString } from '##/utils/type-guards';

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
    ...otherProps
  } = props;

  return (
    <div {...otherProps} ref={ref} className={cnTableData(null, [className])}>
      {rows.slice(...slice).map((row, rowIndex) => {
        const rowkey = rowIndex + slice[0];
        const rowZebraStriped = zebraStriped && rowkey % 2 !== 0;

        return (
          <div
            className={cnTableData('Row')}
            key={rowkey}
            onMouseEnter={getRowMouseEvent(row, onRowMouseEnter)}
            onMouseLeave={getRowMouseEvent(row, onRowMouseLeave)}
            onClick={getRowMouseEvent(row, onRowClick)}
            aria-hidden="true"
          >
            {lowHeaders.map(
              (
                { isSeparator, accessor, pinned, renderCell: RenderCell },
                columnIndex,
              ) => {
                return (
                  <div
                    key={`${columnIndex}-${rowkey}`}
                    ref={columnIndex === 0 ? rowsRefs[rowkey] : undefined}
                    className={cnTableCell({
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
                    })}
                    style={{
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
                      <RenderCell row={row} />
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
