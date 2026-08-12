import { PropsWithHTMLAttributesAndRef } from '@consta/uikit/__internal__/src/utils/types/PropsWithHTMLAttributes';
import { AtomLike } from '@reatom/core';
import React from 'react';

export type ValueOf<T> = T[keyof T];

export type TableColumnPropPinned = 'left' | 'right';

export type TableRenderHeaderCell = (props: {
  title?: string;
  index: number;
  tableRef: React.RefObject<HTMLDivElement>;
}) => React.ReactNode | null;

export type TableRenderCell<T> = (props: {
  row: T;
  rowIndex: number;
  columnIndex: number;
  tableRef: React.RefObject<HTMLDivElement>;
}) => React.ReactNode | null;

export type TabletColSpan<ROW> = (props: {
  row: ROW;
}) => number | 'end' | undefined;

export type TableColumn<ROW> = {
  title?: string;
  width?:
    | number
    | 'auto'
    | '1fr'
    | '2fr'
    | '3fr'
    | '4fr'
    | '5fr'
    | '6fr'
    | '7fr'
    | '8fr'
    | '9fr'
    | '10fr';
  maxWidth?: number;
  minWidth?: number;
  renderHeaderCell?: TableRenderHeaderCell;
  isSeparator?: boolean;
  pinned?: TableColumnPropPinned;
  renderCell?: TableRenderCell<ROW>;
  colSpan?: TabletColSpan<ROW>;
  accessor?: string;
  columns?: TableColumn<ROW>[];
};

export type Header<ROW> = TableColumn<ROW> & {
  position: Position;
  colId?: number;
  parentId?: number;
  key: string;
};

export type Position = {
  colSpan?: number;
  rowSpan?: number;
  level: number;
  gridIndex: number;
  isFirst?: boolean;
  isLastPinnedLeft?: boolean;
  topHeaderGridIndex: number;
  smallTextSize?: boolean;
  height?: number;
};

export type TablePropGetRowId<ROW> = (row: ROW) => string | number;
export type TableRowMouseEvent<ROW> = (
  row: ROW,
  props: { e: React.MouseEvent },
) => void;
export type TableDefaultRow = Record<string, unknown>;

export type TableColumnResizeResult = {
  accessor: string;
  width: number;
};

export type TableResizeEvent = (columns: TableColumnResizeResult[]) => void;

export type TableProps<ROW = TableDefaultRow> = PropsWithHTMLAttributesAndRef<
  {
    columns: TableColumn<ROW>[];
    rows: ROW[];
    getRowKey?: (row: ROW) => string | number;
    getRowHeight?: (row: ROW) => number;
    onRowMouseEnter?: TableRowMouseEvent<ROW>;
    onRowMouseLeave?: TableRowMouseEvent<ROW>;
    onRowClick?: TableRowMouseEvent<ROW>;
    stickyHeader?: boolean;
    virtualScroll?: boolean | [boolean, boolean];
    resizable?: 'inside' | 'outside';
    zebraStriped?: boolean;
    headerZIndex?: number;
    rowHoverEffect?: boolean;
    onScrollToBottom?: (length: number) => void;
    onAfterResize?: TableResizeEvent;
  },
  HTMLDivElement
>;

export type TableComponent = <ROW = TableDefaultRow>(
  props: TableProps<ROW>,
) => React.ReactNode | null;

export type TableHeaderProps<ROW = TableDefaultRow> =
  PropsWithHTMLAttributesAndRef<
    {
      headersAtom: AtomLike<Header<ROW>[]>;
      stickyHeader?: boolean;
      stickyLeftOffsetsAtom: AtomLike<number[]>;
      stickyRightOffsetsAtom: AtomLike<number[]>;
      headerCellsRefsAtom: AtomLike<React.RefObject<HTMLDivElement>[]>;
      bordersAtom: AtomLike<[boolean, boolean, boolean][]>;
      tableRef: React.RefObject<HTMLDivElement>;
    },
    HTMLDivElement
  >;

export type TableHeaderComponent = <ROW = TableDefaultRow>(
  props: TableHeaderProps<ROW>,
) => React.ReactNode | null;

export type TableBodyProps<ROW> = PropsWithHTMLAttributesAndRef<
  {
    topOffsetsAtom: AtomLike<number[]>;
    spaceTopAtom: AtomLike<number>;
    headerHeightAtom: AtomLike<number>;
    resizersElementsAtom: AtomLike<AtomLike<HTMLDivElement | null>[]>;
    header: React.ReactNode;
    body: React.ReactNode;
    resizable?: 'inside' | 'outside';
    stickyTopOffsetsAtom: AtomLike<number[]>;
    stickyHeader?: boolean;
    headerZIndex: number;
    intersectingColumnsAtom: AtomLike<boolean[]>;
    onAfterResize?: TableResizeEvent;
  },
  HTMLDivElement
> & {
  lowHeadersAtom: AtomLike<TableColumn<ROW>[]>;
};

export type TableBodyComponent = <ROW>(
  props: TableBodyProps<ROW>,
) => React.ReactNode | null;

type TableBodyRootProps = PropsWithHTMLAttributesAndRef<
  {
    headerHeightAtom: AtomLike<number>;
    spaceTopAtom: AtomLike<number>;
    sizesAtom: AtomLike<(string | number | undefined)[]>;
    topOffsetsAtom: AtomLike<number[]>;
    stickyTopOffsetsAtom: AtomLike<number[]>;
    headerZIndexAtom: AtomLike<number>;
    resizingAtom: AtomLike<boolean>;
  },
  HTMLDivElement
>;

export type TableBodyRootComponent = (
  props: TableBodyRootProps,
) => React.ReactNode | null;

export type TableDataProps<ROW = TableDefaultRow> =
  PropsWithHTMLAttributesAndRef<
    {
      rowsRefsAtom: AtomLike<React.RefObject<HTMLDivElement>[]>;
      sliceAtom: AtomLike<[number, number]>;
      onRowMouseEnter?: TableRowMouseEvent<ROW>;
      onRowMouseLeave?: TableRowMouseEvent<ROW>;
      onRowClick?: TableRowMouseEvent<ROW>;
      getRowKey?: (row: ROW) => string | number;
      tableRef: React.RefObject<HTMLDivElement>;
      rowHoverEffect?: boolean;
      leftNoVisibleItemsAtom: AtomLike<number>;
      rightNoVisibleItemsAtom: AtomLike<number>;
    },
    HTMLDivElement
  > & {
    lowHeadersAtom: AtomLike<TableColumn<ROW>[]>;
    rows: ROW[];
    zebraStriped?: boolean;
  };

export type TableDataComponent = <ROW = TableDefaultRow>(
  props: TableDataProps<ROW>,
) => React.ReactNode | null;
