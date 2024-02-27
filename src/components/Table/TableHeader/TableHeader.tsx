import './TableHeader.css';

import React, { forwardRef } from 'react';

import { cn } from '##/utils/bem';

import { TableHeaderComponent } from '../types';

export const cnTableHeader = cn('TableHeader');

export const TableHeader: TableHeaderComponent = forwardRef((props, ref) => {
  const { headers, className, ...otherProps } = props;

  console.log(headers);

  return (
    <div {...otherProps} className={cnTableHeader(null, [className])} ref={ref}>
      {headers.map((column) => {
        const style: React.CSSProperties = {};
        if (column.position!.colSpan) {
          style.gridColumnEnd = `span ${column.position!.colSpan}`;
        }
        if (column.position!.rowSpan) {
          style.gridRowEnd = `span ${column.position!.rowSpan}`;
        }
        style.top = 0;
        style.position = 'sticky';
        return (
          <div
            className={cnTableHeader('Cell', {
              isFirst: column.position.isFirst,
            })}
            style={style}
          >
            {column.title}
          </div>
        );
      })}
    </div>
  );
});
