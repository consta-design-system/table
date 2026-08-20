import './TableRow.css';

import { factoryComponent } from '@consta/uikit/__internal__/src/utils/state';
import { PropsWithHTMLAttributesAndRef } from '@consta/uikit/__internal__/src/utils/types/PropsWithHTMLAttributes';
import { action, AtomLike } from '@reatom/core';
import React, { memo } from 'react';

import { cn } from '##/utils/bem';

import { TableRowCell, TableRowCellComponent } from '../TableRowCell';
import { TableColumn, TableRowMouseEvent } from '../types';

const TableRowCellMemo = memo(TableRowCell) as TableRowCellComponent;

type TableRowProps<ROW> = PropsWithHTMLAttributesAndRef<
  {
    lowHeadersAtom: AtomLike<TableColumn<ROW>[]>;
    zebraStriped: boolean;
    index: number;
    row: ROW;
    tableElementAtom: AtomLike<HTMLDivElement | null>;
    leftNoVisibleItemsAtom: AtomLike<number>;
    rightNoVisibleItemsAtom: AtomLike<number>;
    onRowMouseEnter?: TableRowMouseEvent<ROW>;
    onRowMouseLeave?: TableRowMouseEvent<ROW>;
    onRowClick?: TableRowMouseEvent<ROW>;
  },
  HTMLDivElement
>;

const cnTableRow = cn('TableRow');

export type TableRowComponent = <ROW>(
  props: TableRowProps<ROW>,
) => React.ReactNode | null;

const getMiss = (
  colSpan: number | undefined | 'end',
  index: number,
  length: number,
  pinned: boolean,
) => {
  if (pinned) {
    return 0;
  }
  if (colSpan === 'end') {
    return length - index - 1;
  }
  if (typeof colSpan === 'number') {
    return colSpan - 1;
  }
  return 0;
};

export const TableRow: TableRowComponent = factoryComponent((_, propsAtom) => {
  const onMouseEnter = action(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      propsAtom().onRowMouseEnter?.(propsAtom().row, { e });
    },
  );

  const onMouseLeave = action(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      propsAtom().onRowMouseLeave?.(propsAtom().row, { e });
    },
  );

  const onClick = action((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    propsAtom().onRowClick?.(propsAtom().row, { e });
  });

  return ({
    className,
    index: rowIndex,
    lowHeadersAtom,
    zebraStriped,
    row,
    tableElementAtom,
    leftNoVisibleItemsAtom,
    rightNoVisibleItemsAtom,
    ref,
    onRowMouseEnter,
    onRowMouseLeave,
    onRowClick,
    ...otherProps
  }) => {
    const lowHeaders = lowHeadersAtom();
    const leftNoVisibleItems = leftNoVisibleItemsAtom();
    const rightNoVisibleItems = rightNoVisibleItemsAtom();

    let miss = 0;

    const nodes: React.ReactNode[] = [];

    for (let columnIndex = 0; columnIndex < lowHeaders.length; columnIndex++) {
      const {
        isSeparator,
        accessor,
        pinned,
        renderCell: RenderCell,
        colSpan: getColSpan,
      } = lowHeaders[columnIndex];

      if (miss) {
        miss = miss ? miss - 1 : miss;

        continue;
      }

      miss = getMiss(
        getColSpan?.({ row }),
        columnIndex,
        lowHeaders.length,
        !!pinned,
      );

      if (
        (!pinned &&
          columnIndex !== 0 &&
          leftNoVisibleItems >= 1 &&
          leftNoVisibleItems - columnIndex - miss >= 1) ||
        (!pinned &&
          columnIndex !== 0 &&
          rightNoVisibleItems >= 0 &&
          rightNoVisibleItems + columnIndex >= lowHeaders.length)
      ) {
        continue;
      }

      nodes.push(
        <TableRowCellMemo
          key={cnTableRow('Cell', { key: accessor || columnIndex })}
          borderLeft={
            columnIndex !== 0 &&
            !(
              pinned !== 'left' &&
              lowHeaders[columnIndex - 1]?.pinned === 'left'
            )
          }
          borderRight={
            pinned === 'left' && lowHeaders[columnIndex + 1]?.pinned !== 'left'
          }
          borderTop={!isSeparator && rowIndex !== 0}
          ref={columnIndex === 0 ? ref : undefined}
          row={row}
          rowIndex={rowIndex}
          miss={miss}
          index={columnIndex}
          tableElementAtom={tableElementAtom}
          accessor={accessor}
          separator={isSeparator}
          pinned={pinned}
          renderCell={RenderCell}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onClick={onClick}
        />,
      );
    }

    console.log('TableRow', { row });

    return (
      <div
        {...otherProps}
        className={cnTableRow({ zebraStriped }, [className])}
        aria-hidden="true"
      >
        {nodes}
      </div>
    );
  };
});
