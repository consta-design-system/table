import './TableBody.css';

import React, { forwardRef } from 'react';

import { cn } from '##/utils/bem';

import { getColumnsSize } from '../helpers';
import { TableBodyComponent } from '../types';

export const cnTableBody = cn('TableBody');

export const TableBody: TableBodyComponent = forwardRef((props, ref) => {
  const {
    columnsWidths,
    className,
    children,
    style: styleProp = {},
    ...otherProps
  } = props;

  const style = {
    '--table-grid-template-columns': getColumnsSize(columnsWidths),
    ...styleProp,
  };

  return (
    <div
      {...otherProps}
      ref={ref}
      className={cnTableBody(null, [className])}
      style={style}
    >
      {children}
    </div>
  );
});
