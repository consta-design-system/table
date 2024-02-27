import React, { forwardRef } from 'react';

import { cn } from '##/utils/bem';

import { TableColumnInner, TableHeaderComponent } from '../types';

export const cnTableHeader = cn('TableHeader');

const columnsRender = (
  columns?: TableColumnInner[],
  parentIndex: number | string = 0,
) => {
  return columns?.map((col, index) => {
    return (
      <>
        <div
          attr-id={`id-${parentIndex}-${index}`}
          style={{ gridRowEnd: `span ${col.columns?.length || 1}` }}
        >
          {col.title}
        </div>
        {columnsRender(col.columns, `${parentIndex}-${index}`)}
      </>
    );
  });
};

export const TableHeader: TableHeaderComponent = forwardRef((props, ref) => {
  const { columns, className } = props;
  console.log(columns);
  return (
    <div className={cnTableHeader(null, [className])}>
      {columnsRender(columns)}
    </div>
  );
});
