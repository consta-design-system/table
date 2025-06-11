import './TableRowCell.css';

import { PropsWithHTMLAttributesAndRef } from '@consta/uikit/__internal__/src/utils/types/PropsWithHTMLAttributes';
import React, { forwardRef, memo } from 'react';

import { DataCell } from '##/components/DataCell';
import { cn } from '##/utils/bem';
import { isNotNil, isNumber, isString } from '##/utils/type-guards';

import { cnTableCell } from '../TableCell';
import { TableDefaultRow, TableRenderCell } from '../types';

type TableRowCellProps = PropsWithHTMLAttributesAndRef<
  {
    row: TableDefaultRow;
    index: number;
    separator?: boolean;
    accessor?: string;
    pinned?: 'left' | 'right';
    borderLeft: boolean;
    borderRight: boolean;
    borderTop: boolean;
    miss: number;
    renderCell?: TableRenderCell<TableDefaultRow> | undefined;
    rowIndex: number;
    tableRef: React.RefObject<HTMLDivElement>;
  },
  HTMLDivElement
>;

const cnTableRowCell = cn('TableRowCell');

const getCellDataByAccessor = <T,>(
  row: T,
  accessor?: (keyof T extends string ? string & keyof T : never) | undefined,
  separator?: boolean,
) => {
  if (separator) {
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

const TableRowCellRender = (
  props: TableRowCellProps,
  ref: React.Ref<HTMLDivElement>,
) => {
  const {
    className,
    index,
    separator,
    accessor,
    pinned,
    borderLeft,
    borderRight,
    borderTop,
    miss,
    renderCell: RenderCell,
    row,
    rowIndex,
    tableRef,
    ...otherProps
  } = props;

  return (
    <div
      {...otherProps}
      ref={ref}
      className={cnTableRowCell(
        {
          pinned: !!pinned,
        },
        [
          cnTableCell({
            separator,
            borderLeft,
            borderRight,
            borderTop,
            sticky: !!pinned,
          }),
          className,
        ],
      )}
      style={{
        left:
          pinned === 'left'
            ? `var(--table-column-sticky-left-offset-${index})`
            : undefined,
        right:
          pinned === 'right'
            ? `var(--table-column-sticky-right-offset-${index})`
            : undefined,
        gridColumn: `${index + 1} / span ${miss > 0 ? miss + 1 : 1}`,
      }}
    >
      {isNotNil(RenderCell) ? (
        <RenderCell
          row={row}
          rowIndex={rowIndex}
          columnIndex={index}
          tableRef={tableRef}
        />
      ) : (
        getCellDataByAccessor(row, accessor, separator)
      )}
    </div>
  );
};

export const TableRowCell = memo(forwardRef(TableRowCellRender));
