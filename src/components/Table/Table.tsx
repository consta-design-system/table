import { objectWithDefault } from '@consta/uikit/__internal__/src/utils/object/objectWithDefault';
import { setRefs } from '@consta/uikit/__internal__/src/utils/setRef';
import {
  factoryComponent,
  virtualScrollEffect,
} from '@consta/uikit/__internal__/src/utils/state';
import { action, computed } from '@reatom/core';
import React, { memo } from 'react';

import {
  TableComponent,
  TableDataComponent,
  TableHeaderComponent,
  TableProps,
} from '##/components/Table/types';

import { headerDataModel } from './model';
import { TableBody } from './TableBody';
import { TableData } from './TableData';
import { TableHeader } from './TableHeader/TableHeader';

const MemoTableHeader = memo(TableHeader) as TableHeaderComponent;
const MemoTableData = memo(TableData) as TableDataComponent;

export const Table = factoryComponent<HTMLDivElement, TableProps>(
  (props, propsAtom) => {
    const propsWithDefault = objectWithDefault({ headerZIndex: 1 }, props);
    const {
      columns,
      rows,
      stickyHeader,
      virtualScroll,
      resizable,
      zebraStriped,
      headerZIndex,
      onRowMouseEnter,
      onRowMouseLeave,
      onRowClick,
      getRowKey,
      rowHoverEffect,
      onScrollToBottom,
      ...otherProps
    } = propsWithDefault;

    const {
      resizerTopOffsetsAtom,
      headerHeightAtom,
      resizersElementsAtom,
      lowHeadersAtom,
      stickyTopOffsetsAtom,
      flattenedHeadersAtom,
      headerCellsElementsAtom,
      stickyLeftOffsetsAtom,
      stickyRightOffsetsAtom,
      bordersFlattenedHeadersAtom,
      intersectingColumnsAtom,
      leftNoVisibleItemsAtom,
      rightNoVisibleItemsAtom,
    } = headerDataModel(
      computed(() => propsAtom().columns),
      computed(() => propsAtom().virtualScroll),
    );

    const { listElementsAtom, scrollElementAtom, sliceAtom, spaceTopAtom } =
      virtualScrollEffect({
        length: computed(() => propsAtom().rows.length),
        isActive: computed(() => {
          const { virtualScroll } = propsAtom();
          return !!(Array.isArray(virtualScroll)
            ? virtualScroll[1]
            : virtualScroll);
        }),
        onScrollToBottom,
      });

    const ref = action((el: HTMLDivElement | null) =>
      setRefs([scrollElementAtom.set, propsAtom().ref], el),
    );

    return () => (
      <TableBody
        {...otherProps}
        topOffsetsAtom={resizerTopOffsetsAtom}
        spaceTopAtom={spaceTopAtom}
        ref={ref}
        headerHeightAtom={headerHeightAtom}
        lowHeadersAtom={lowHeadersAtom}
        resizersElementsAtom={resizersElementsAtom}
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
  },
) as TableComponent;
