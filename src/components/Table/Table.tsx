import { objectWithDefault } from '@consta/uikit/__internal__/src/utils/object/objectWithDefault';
import { usePropAtom } from '@consta/uikit/__internal__/src/utils/state/usePickAtom';
import { useSendToAtom } from '@consta/uikit/__internal__/src/utils/state/useSendToAtom';
import { withCtx } from '@consta/uikit/__internal__/src/utils/state/withCtx';
import { useForkRef } from '@consta/uikit/useForkRef';
import React, { forwardRef, memo } from 'react';

import {
  TableComponent,
  TableDataComponent,
  TableHeaderComponent,
  TableProps,
} from '##/components/Table/types';
import { useVirtualScrollAtom } from '##/hooks/useVirtualScrollAtom';

import { useHeaderData } from './helpers';
import { TableBody } from './TableBody';
import { TableData } from './TableData';
import { TableHeader } from './TableHeader/TableHeader';

const MemoTableHeader = memo(TableHeader) as unknown as TableHeaderComponent;
const MemoTableData = memo(TableData) as unknown as TableDataComponent;

export const TableRender = (
  props: TableProps,
  ref: React.Ref<HTMLDivElement>,
) => {
  const {
    columns,
    rows,
    stickyHeader,
    virtualScroll,
    resizable,
    zebraStriped,
    headerZIndex = 1,
    onRowMouseEnter,
    onRowMouseLeave,
    onRowClick,
    getRowKey,
    rowHoverEffect,
    onScrollToBottom,
    ...otherProps
  } = props;

  const propsAtom = useSendToAtom(
    objectWithDefault({ headerZIndex: 1 }, props),
  );

  const {
    resizerTopOffsetsAtom,
    headerHeightAtom,
    resizersRefsAtom,
    lowHeadersAtom,
    stickyTopOffsetsAtom,
    flattenedHeadersAtom,
    headerCellsRefsAtom,
    stickyLeftOffsetsAtom,
    stickyRightOffsetsAtom,
    bordersFlattenedHeadersAtom,
    intersectingColumnsAtom,
    leftNoVisibleItemsAtom,
    rightNoVisibleItemsAtom,
  } = useHeaderData(
    usePropAtom(propsAtom, 'columns'),
    usePropAtom(propsAtom, 'virtualScroll'),
  );

  const { listRefsAtom, scrollElementRef, sliceAtom, spaceTopAtom } =
    useVirtualScrollAtom({
      length: rows.length,
      isActive: Array.isArray(virtualScroll) ? virtualScroll[1] : virtualScroll,
      onScrollToBottom,
    });

  return (
    <TableBody
      {...otherProps}
      topOffsetsAtom={resizerTopOffsetsAtom}
      spaceTopAtom={spaceTopAtom}
      ref={useForkRef([scrollElementRef, ref])}
      headerHeightAtom={headerHeightAtom}
      lowHeadersAtom={lowHeadersAtom}
      resizersRefsAtom={resizersRefsAtom}
      resizable={resizable}
      stickyTopOffsetsAtom={stickyTopOffsetsAtom}
      stickyHeader={stickyHeader}
      headerZIndex={headerZIndex}
      intersectingColumnsAtom={intersectingColumnsAtom}
      header={
        <MemoTableHeader
          headersAtom={flattenedHeadersAtom}
          headerCellsRefsAtom={headerCellsRefsAtom}
          stickyHeader={stickyHeader}
          stickyLeftOffsetsAtom={stickyLeftOffsetsAtom}
          stickyRightOffsetsAtom={stickyRightOffsetsAtom}
          bordersAtom={bordersFlattenedHeadersAtom}
          tableRef={scrollElementRef}
        />
      }
      body={
        <MemoTableData
          lowHeadersAtom={lowHeadersAtom}
          rows={rows}
          rowsRefsAtom={listRefsAtom}
          sliceAtom={sliceAtom}
          zebraStriped={zebraStriped}
          onRowMouseEnter={onRowMouseEnter}
          onRowMouseLeave={onRowMouseLeave}
          onRowClick={onRowClick}
          getRowKey={getRowKey}
          tableRef={scrollElementRef}
          rowHoverEffect={rowHoverEffect}
          leftNoVisibleItemsAtom={leftNoVisibleItemsAtom}
          rightNoVisibleItemsAtom={rightNoVisibleItemsAtom}
        />
      }
    />
  );
};

export const Table = withCtx(forwardRef(TableRender)) as TableComponent;
