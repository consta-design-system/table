import './TableHeader.css';

import { forkRef } from '@consta/uikit/useForkRef';
import React, { forwardRef } from 'react';

import { HeaderDataCell } from '##/components/HeaderDataCell';
import { cn } from '##/utils/bem';

import { cnTableCell } from '../TableCell';
import { TableHeaderComponent, TableRenderHeaderCell } from '../types';

export const cnTableHeader = cn('TableHeader');

const DefaultRenderHeaderCell: TableRenderHeaderCell = ({ title }) => (
  <HeaderDataCell>{title}</HeaderDataCell>
);

export const TableHeader: TableHeaderComponent = forwardRef((props, ref) => {
  const {
    headers,
    className,
    stickyLeftOffsets,
    stickyRightOffsets,
    stickyHeader,
    headerCellsRefs,
    borders,
    ...otherProps
  } = props;

  return (
    <div {...otherProps} className={cnTableHeader(null, [className])} ref={ref}>
      {headers.map((column, index) => {
        const style: React.CSSProperties = {};
        if (column.position!.colSpan) {
          style.gridColumnEnd = `span ${column.position!.colSpan}`;
        }
        if (column.position!.rowSpan) {
          style.gridRowEnd = `span ${column.position!.rowSpan}`;
        }

        const RenderHeaderCell =
          column.renderHeaderCell || DefaultRenderHeaderCell;

        return (
          <div
            className={cnTableHeader('Cell', { pinned: !!column.pinned }, [
              cnTableCell({
                separator: column.isSeparator,
                borderLeft: borders[index][0],
                borderRight: borders[index][1],
                borderTop: borders[index][2],
                sticky: !!column.pinned || stickyHeader,
                up: !!column.pinned,
              }),
            ])}
            style={{
              ...style,
              top: stickyHeader
                ? `var(--table-column-sticky-top-offset-${index})`
                : undefined,
              left:
                column.pinned === 'left'
                  ? `var(--table-column-sticky-left-offset-${stickyLeftOffsets[index]})`
                  : undefined,
              right:
                column.pinned === 'right'
                  ? `var(--table-column-sticky-right-offset-${stickyRightOffsets[index]})`
                  : undefined,
            }}
            ref={forkRef([headerCellsRefs[index]])}
            key={cnTableHeader('Cell', { index })}
          >
            {column.isSeparator ? null : (
              <RenderHeaderCell title={column.title} />
            )}
          </div>
        );
      })}
    </div>
  );
});
