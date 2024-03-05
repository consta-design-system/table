import './TableHeader.css';

import React, { forwardRef } from 'react';

import { cn } from '##/utils/bem';

import { TableHeaderComponent } from '../types';

export const cnTableHeader = cn('TableHeader');

export const TableHeader: TableHeaderComponent = forwardRef((props, ref) => {
  const {
    headers,
    className,
    headerRowsRefs,
    headerRowsHeights,
    ...otherProps
  } = props;

  console.log(headers);

  console.log(headerRowsRefs);

  return (
    <div {...otherProps} className={cnTableHeader(null, [className])} ref={ref}>
      {headers.map((column, columnIdx) => {
        const style: React.CSSProperties = {};
        if (column.position!.colSpan) {
          style.gridColumnEnd = `span ${column.position!.colSpan}`;
        }
        if (column.position!.rowSpan) {
          style.gridRowEnd = `span ${column.position!.rowSpan}`;
        }
        // if (isStickyHeader) {
        style.top = headerRowsHeights
          .slice(0, column.position!.level)
          .reduce((a: number, b: number) => a + b, 0);
        // }
        // style.top = 0;
        style.position = 'sticky';
        return (
          <div
            className={cnTableHeader('Cell', {
              isFirst: column.position.isFirst,
            })}
            style={style}
            ref={(ref: HTMLDivElement | null): void => {
              headerRowsRefs.current[columnIdx] = ref;
            }}
          >
            {column.title}
          </div>
        );
      })}
    </div>
  );
});
