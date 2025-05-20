import './TableRow.css';

import { PropsWithHTMLAttributesAndRef } from '@consta/uikit/__internal__/src/utils/types/PropsWithHTMLAttributes';
import { AtomMut } from '@reatom/core';
import { useAtom } from '@reatom/npm-react';
import React, { forwardRef } from 'react';

import { DataCell } from '##/components/DataCell';
import { cn } from '##/utils/bem';
import { isNotNil, isNumber, isString } from '##/utils/type-guards';

import { cnTableCell } from '../TableCell';
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
  },
  HTMLDivElement
>;

const cnTableRow = cn('TableRow');

type TableRowComponent = (props: TableRowProps) => React.ReactElement | null;

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

const getCellDataByAccessor = <T,>(
  row: T,
  accessor?: (keyof T extends string ? string & keyof T : never) | undefined,
  isSeparator?: boolean,
) => {
  if (isSeparator) {
    return '';
  }

  if (!accessor) {
    return '';
  }

  const data = row?.[accessor];

  if (isString(data) || isNumber(data)) {
    return <DataCell>{data.toString()}</DataCell>;
  }

  return '';
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
          columnIndex !== 0 &&
          !(pinned !== 'left' && lowHeaders[columnIndex - 1]?.pinned === 'left')
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
