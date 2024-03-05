import React, { forwardRef } from 'react';

import { useVirtualScroll } from '##/hooks/useVirtualScroll';

import { getMaxLevel, transformColumns, useHeaderData } from './helpers';
import { TableBody } from './TableBody';
import { TableData } from './TableData';
import { TableHeader } from './TableHeader/TableHeader';
import { TableComponent, TableProps } from './types';
// import {useRefs} from '@consta/uikit/useRefs';
// import {} from '@consta/uikit/useResizeObserved';

export const TableRender = <T,>(
  props: TableProps<T>,
  ref: React.Ref<HTMLDivElement>,
) => {
  const { columns, rows } = props;
  // const [headerRef] = useRefs(1);

  // const [columsWithWidth] = prepareColumns(columns);
  console.log(transformColumns(columns, getMaxLevel(columns)));
  const headerData = useHeaderData(columns);

  console.log(headerData);
  // const rowRefs = useRefs(rows.length, [rows]);

  const {
    listRefs: rowsRefs,
    scrollElementRef,
    slice,
    spaceTop,
  } = useVirtualScroll({ length: rows.length, isActive: true });

  // console.log(slice);

  console.log(headerData.flattenedHeaders, 'flattenedHeaders');

  return (
    <div ref={scrollElementRef} style={{ maxHeight: '100%', overflow: 'auto' }}>
      <TableBody
        columnsWidths={headerData.columnWidths}
        style={{ marginTop: spaceTop }}
      >
        <TableHeader
          headers={headerData.flattenedHeaders}
          headerRowsRefs={headerData.headerRowsRefs}
          headerRowsHeights={headerData.headerRowsHeights}
        />
        <TableData
          // ref={scrollElementRef}
          // style={{ height: 300, overflow: 'auto' }}
          lowHeaders={headerData.lowHeaders}
          rows={rows}
          rowsRefs={rowsRefs}
          slice={slice}
          spaceTop={spaceTop}
        />
      </TableBody>
    </div>
  );
};

export const Table = forwardRef(TableRender) as TableComponent;
