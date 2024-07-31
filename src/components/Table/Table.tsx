import { useForkRef } from '@consta/uikit/useForkRef';
import { useVirtualScroll } from '@consta/uikit/useVirtualScroll';
import React, { forwardRef, memo } from 'react';

import { useHeaderData } from './helpers';
import { TableBody } from './TableBody';
import { TableData } from './TableData';
import { TableHeader } from './TableHeader/TableHeader';
import { TableComponent, TableHeaderComponent, TableProps } from './types';

const MemoTableHeader = memo(TableHeader) as unknown as TableHeaderComponent;

export const TableRender = (
  props: TableProps,
  ref: React.Ref<HTMLDivElement>,
) => {
  const {
    columns,
    rows,
    stickyHeader,
    virtualScroll,
    style,
    className,
    resizable,
    zebraStriped,
    headerZIndex = 1,
    onRowMouseEnter,
    onRowMouseLeave,
    onRowClick,
  } = props;

  const headerData = useHeaderData(columns);

  const {
    listRefs: rowsRefs,
    scrollElementRef,
    slice,
    spaceTop,
  } = useVirtualScroll({
    length: rows.length,
    isActive: virtualScroll,
  });

  return (
    <TableBody
      topOffsets={headerData.resizerTopOffsets}
      spaceTop={spaceTop}
      ref={useForkRef([scrollElementRef, ref])}
      style={style}
      headerHeight={headerData.headerHeight}
      className={className}
      lowHeaders={headerData.lowHeaders}
      resizersRefs={headerData.resizersRefs}
      resizable={resizable}
      stickyTopOffsets={headerData.stickyTopOffsets}
      stickyHeader={stickyHeader}
      headerZIndex={headerZIndex}
      header={
        <MemoTableHeader
          headers={headerData.flattenedHeaders}
          headerCellsRefs={headerData.headerCellsRefs}
          stickyHeader={stickyHeader}
          stickyLeftOffsets={headerData.stickyLeftOffsets}
          stickyRightOffsets={headerData.stickyRightOffsets}
          borders={headerData.bordersFlattenedHeaders}
        />
      }
      body={
        <TableData
          lowHeaders={headerData.lowHeaders}
          rows={rows}
          rowsRefs={rowsRefs}
          slice={slice}
          zebraStriped={zebraStriped}
          onRowMouseEnter={onRowMouseEnter}
          onRowMouseLeave={onRowMouseLeave}
          onRowClick={onRowClick}
        />
      }
    />
  );
};

export const Table = forwardRef(TableRender) as TableComponent;
