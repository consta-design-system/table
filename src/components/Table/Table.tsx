import { setRefs } from '@consta/uikit/__internal__/src/utils/setRef';
import {
  factoryComponent,
  propAction,
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
import { virtualScrollEffect } from './virtualScrollEffect';

const MemoTableHeader = memo(TableHeader) as TableHeaderComponent;
const MemoTableData = memo(TableData) as TableDataComponent;

export const Table = factoryComponent<HTMLDivElement, TableProps>(
  (_, propsAtom) => {
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
          const { virtualScroll, rows } = propsAtom();
          if (rows.length === 0) return false;
          return !!(Array.isArray(virtualScroll)
            ? virtualScroll[1]
            : virtualScroll);
        }),
        onEndReached: action((index: number) =>
          propsAtom().onScrollToBottom?.(index),
        ),
        busy: headerHeightAtom,
      });

    const ref = action((el: HTMLDivElement | null) =>
      setRefs([scrollElementAtom.set, propsAtom().ref], el),
    );

    const [onRowMouseEnter, onRowMouseLeave, onRowClick, getRowKey] =
      propAction(propsAtom, [
        'onRowMouseEnter',
        'onRowMouseLeave',
        'onRowClick',
        'getRowKey',
      ]);

    return ({
      columns,
      rows,
      stickyHeader,
      virtualScroll,
      resizable,
      zebraStriped,
      headerZIndex = 1,
      rowHoverEffect,
      onRowMouseEnter: onRowMouseEnterProp,
      onRowMouseLeave: onRowMouseLeaveProp,
      onRowClick: onRowClickProp,
      getRowKey: getRowKeyProp,
      onScrollToBottom,
      ...otherProps
    }) => (
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
            headerCellsElementsAtom={headerCellsElementsAtom}
            stickyHeader={stickyHeader}
            stickyLeftOffsetsAtom={stickyLeftOffsetsAtom}
            stickyRightOffsetsAtom={stickyRightOffsetsAtom}
            bordersAtom={bordersFlattenedHeadersAtom}
            tableElementAtom={scrollElementAtom}
          />
        }
        body={
          <MemoTableData
            lowHeadersAtom={lowHeadersAtom}
            rows={rows}
            rowsElementsAtom={listElementsAtom}
            sliceAtom={sliceAtom}
            zebraStriped={zebraStriped}
            onRowMouseEnter={onRowMouseEnter}
            onRowMouseLeave={onRowMouseLeave}
            onRowClick={onRowClick}
            getRowKey={getRowKey}
            tableElementAtom={scrollElementAtom}
            rowHoverEffect={rowHoverEffect}
            leftNoVisibleItemsAtom={leftNoVisibleItemsAtom}
            rightNoVisibleItemsAtom={rightNoVisibleItemsAtom}
          />
        }
      />
    );
  },
) as TableComponent;
