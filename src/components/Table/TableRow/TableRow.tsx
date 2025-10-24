import './TableRow.css';

import { PropsWithHTMLAttributesAndRef } from '@consta/uikit/__internal__/src/utils/types/PropsWithHTMLAttributes';
import { AtomMut } from '@reatom/core';
import { useAtom } from '@reatom/npm-react';
import React, { forwardRef } from 'react';

import { cn } from '##/utils/bem';

import { TableRowCell } from '../TableRowCell';
import { TableColumn, TableDefaultRow } from '../types';

type TableRowProps = PropsWithHTMLAttributesAndRef<
  {
    lowHeadersAtom: AtomMut<TableColumn<TableDefaultRow>[]>;
    zebraStriped: boolean;
    index: number;
    row: TableDefaultRow;
    tableRef: React.RefObject<HTMLDivElement>;
    leftNoVisibleItemsAtom: AtomMut<number>;
    rightNoVisibleItemsAtom: AtomMut<number>;
    borderBetweenColumns?: boolean;
    borderBetweenRows?: boolean;
  },
  HTMLDivElement
>;

const cnTableRow = cn('TableRow');

type TableRowComponent = (props: TableRowProps) => React.ReactNode | null;

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

export const TableRow: TableRowComponent = forwardRef((props, ref) => {
  const {
    className,
    index: rowIndex,
    lowHeadersAtom,
    zebraStriped,
    row,
    tableRef,
    leftNoVisibleItemsAtom,
    rightNoVisibleItemsAtom,
    borderBetweenColumns,
    borderBetweenRows,
    ...otherProps
  } = props;
  const [lowHeaders] = useAtom(lowHeadersAtom);
  const [leftNoVisibleItems] = useAtom(leftNoVisibleItemsAtom);
  const [rightNoVisibleItems] = useAtom(rightNoVisibleItemsAtom);

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
      <TableRowCell
        key={cnTableRow('Cell', { key: accessor || columnIndex })}
        borderLeft={
          borderBetweenColumns
            ? columnIndex !== 0 &&
              !(
                pinned !== 'left' &&
                lowHeaders[columnIndex - 1]?.pinned === 'left'
              )
            : false
        }
        borderRight={
          borderBetweenColumns
            ? pinned === 'left' &&
              lowHeaders[columnIndex + 1]?.pinned !== 'left'
            : false
        }
        borderTop={borderBetweenRows ? !isSeparator && rowIndex !== 0 : false}
        ref={columnIndex === 0 ? ref : undefined}
        row={row}
        rowIndex={rowIndex}
        miss={miss}
        index={columnIndex}
        tableRef={tableRef}
        accessor={accessor}
        separator={isSeparator}
        pinned={pinned}
        renderCell={RenderCell}
      />,
    );
  }

  return (
    <div
      {...otherProps}
      className={cnTableRow({ zebraStriped }, [className])}
      aria-hidden="true"
    >
      {nodes}
    </div>
  );
});
