import './TableRowCell.css';

import { factoryComponent } from '@consta/uikit/__internal__/src/utils/state';
import { PropsWithHTMLAttributesAndRef } from '@consta/uikit/__internal__/src/utils/types/PropsWithHTMLAttributes';
import { AtomLike, computed } from '@reatom/core';
import React from 'react';

import { DataCell } from '##/components/DataCell';
import { cn } from '##/utils/bem';
import { isNotNil, isNumber, isString } from '##/utils/type-guards';

import { cnTableCell } from '../TableCell';
import { TableRenderCell } from '../types';

type TableRowCellProps<ROW> = PropsWithHTMLAttributesAndRef<
  {
    row: ROW;
    index: number;
    separator?: boolean;
    accessor?: string;
    pinned?: 'left' | 'right';
    borderLeft: boolean;
    borderRight: boolean;
    borderTop: boolean;
    miss: number;
    renderCell?: TableRenderCell<ROW> | undefined;
    rowIndex: number;
    tableElementAtom: AtomLike<HTMLDivElement | null>;
  },
  HTMLDivElement
>;

export type TableRowCellComponent = <ROW>(
  props: TableRowCellProps<ROW>,
) => React.ReactNode | null;

const cnTableRowCell = cn('TableRowCell');

const getCellDataByAccessor = <T,>(
  row: T,
  accessor?: string | undefined,
  separator?: boolean,
) => {
  if (separator) {
    return '';
  }

  if (!accessor) {
    return '';
  }

  const data =
    row?.[accessor as keyof T extends string ? string & keyof T : never];

  if (isString(data) || isNumber(data)) {
    return <DataCell>{data.toString()}</DataCell>;
  }

  return '';
};

export const TableRowCell: TableRowCellComponent = factoryComponent(
  ({ tableElementAtom }) => {
    const tableRefAtom = computed(() => ({
      current: tableElementAtom(),
    }));

    return ({
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
      tableElementAtom,
      ref,
      ...otherProps
    }) => {
      const tableRef = tableRefAtom();

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
            ['--table-cell-grid-column-index' as string]: index,
            ['--table-cell-grid-row-index' as string]: rowIndex,
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
  },
);
