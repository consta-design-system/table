import './TableBody.css';

import React, { forwardRef } from 'react';

import { cn } from '##/utils/bem';

import { getGridTamplate } from '../helpers';
import { TableBodyComponent } from '../types';

export const cnTableBody = cn('TableBody');

export const TableBody: TableBodyComponent = forwardRef((props, ref) => {
  const {
    columnsWidths,
    className,
    children,
    style = {},
    ...otherProps
  } = props;

  return (
    <div
      {...otherProps}
      ref={ref}
      className={cnTableBody(null, [className])}
      style={{
        ['--table-grid-template-columns' as string]:
          getGridTamplate(columnsWidths),
        ...style,
      }}
    >
      {children}
    </div>
  );
});
