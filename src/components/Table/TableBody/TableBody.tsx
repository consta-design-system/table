import React, { forwardRef } from 'react';

import { cn } from '##/utils/bem';

import { TableBodyComponent, TableColumnInner } from '../types';

export const cnTableBody = cn('TableBody');

const columnsVars = (
  style: Record<string, string>,
  columns?: TableColumnInner[],
  parentIndex: number | string = 0,
) => {
  columns?.map((col, index) => {
    style[
      `--table-body-col-width-${parentIndex}-${index}` as string
    ] = `${col.width}px`;
    columnsVars(style, col.columns, `${parentIndex}-${index}`);
  });
};

export const TableBody: TableBodyComponent = forwardRef((props, ref) => {
  const {
    columns,
    className,
    children,
    style: styleProp = {},
    ...otherProps
  } = props;

  const style = { ...styleProp };
  columnsVars(style, columns);

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

// export const TableBody = forwardRef(TableBodyRender) as TableHeaderComponent;
