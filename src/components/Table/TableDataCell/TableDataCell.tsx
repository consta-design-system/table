import './TableDataCell.css';

import { forkRef } from '@consta/uikit/useForkRef';
import React, { forwardRef, memo, useRef } from 'react';

import { cn } from '##/utils/bem';
import { PropsWithHTMLAttributes } from '##/utils/types/PropsWithHTMLAttributes';

import { cnTableCell } from '../TableCell';

export const cnTableDataCell = cn('TableDataCell');

export const TableDataCell = memo(
  forwardRef<
    HTMLDivElement,
    PropsWithHTMLAttributes<
      {
        colSpan?: number;
        pinned?: 'left' | 'right';
        columnIndex: number;
        isSeparator?: boolean;
        borderLeft?: boolean;
        borderRight?: boolean;
        borderTop?: boolean;
        tableRef: React.RefObject<HTMLDivElement>;
        children: () => React.ReactNode | React.ReactNode;
      },
      HTMLDivElement
    >
  >(
    (
      {
        columnIndex,
        pinned,
        isSeparator,
        borderLeft,
        borderRight,
        borderTop,
        colSpan,
        children,
        tableRef,
      },
      ref,
    ) => {
      const rootRef = useRef<HTMLDivElement>(null);

      return (
        <div
          ref={forkRef([ref, rootRef])}
          className={cnTableDataCell(
            {
              pinned: !!pinned,
            },
            [
              cnTableCell({
                separator: isSeparator,
                borderLeft,
                borderRight,
                borderTop,
                sticky: !!pinned,
              }),
            ],
          )}
          style={{
            ['--table-cell-col-span' as string]: colSpan,
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
          {children()}
        </div>
      );
    },
  ),
);
