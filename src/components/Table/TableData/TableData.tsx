import './TableData.css';

import { factoryComponent } from '@consta/uikit/__internal__/src/utils/state';
import { bind } from '@reatom/core';
import React, { memo } from 'react';

import { cn } from '##/utils/bem';

import { getRowKeyValue } from '../mergeCells';
import { TableRow, TableRowComponent } from '../TableRow';
import { TableDataComponent } from '../types';

const TableRowMemo = memo(TableRow) as TableRowComponent;

export const cnTableData = cn('TableData');

export const TableData: TableDataComponent = factoryComponent(() => {
  return ({
    className,
    rowsAtom,
    lowHeadersAtom,
    rowsElementsAtom,
    sliceAtom,
    zebraStriped = false,
    onRowMouseEnter,
    onRowMouseLeave,
    onRowClick,
    getRowKey,
    tableElementAtom,
    rowHoverEffect,
    leftNoVisibleItemsAtom,
    rightNoVisibleItemsAtom,
    mergeCellsAtom,
    ...otherProps
  }) => {
    const rowsElements = rowsElementsAtom();
    const slice = sliceAtom();

    return (
      <div
        {...otherProps}
        className={cnTableData({ rowHoverEffect }, [className])}
      >
        {rowsAtom().map((row, index) => {
          const rowIndex = index + slice[0];
          const rowZebraStriped = zebraStriped && rowIndex % 2 !== 0;
          const rowKey = getRowKeyValue(row, getRowKey, rowIndex);

          return (
            <TableRowMemo
              key={rowKey}
              rowKey={rowKey}
              mergeCellsAtom={mergeCellsAtom}
              row={row}
              index={rowIndex}
              lowHeadersAtom={lowHeadersAtom}
              zebraStriped={rowZebraStriped}
              tableElementAtom={tableElementAtom}
              ref={bind((el) => {
                rowsElements[rowIndex].set(el);
              })}
              leftNoVisibleItemsAtom={leftNoVisibleItemsAtom}
              rightNoVisibleItemsAtom={rightNoVisibleItemsAtom}
              onRowMouseEnter={onRowMouseEnter}
              onRowMouseLeave={onRowMouseLeave}
              onRowClick={onRowClick}
            />
          );
        })}
      </div>
    );
  };
});
