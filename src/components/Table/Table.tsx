import { setRefs } from '@consta/uikit/__internal__/src/utils/setRef';
import {
  factoryComponent,
  propAction,
} from '@consta/uikit/__internal__/src/utils/state';
import { action, wrap } from '@reatom/core';
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
      listElementsAtom,
      scrollElementAtom,
      sliceAtom,
      spaceTopAtom,
      slicesRowsAtom,
      mergeCellsAtom,
    } = headerDataModel(propsAtom);

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
    }) => {
      if (columns.length === 0) {
        return null;
      }

      return (
        <TableBody
          {...otherProps}
          topOffsetsAtom={resizerTopOffsetsAtom}
          spaceTopAtom={spaceTopAtom}
          ref={wrap(ref)}
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
              rowsAtom={slicesRowsAtom}
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
              mergeCellsAtom={mergeCellsAtom}
            />
          }
        />
      );
    };
  },
) as TableComponent;
