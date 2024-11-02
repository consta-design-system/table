import { PropsWithHTMLAttributesAndRef } from '@consta/uikit/__internal__/src/utils/types/PropsWithHTMLAttributes';

export type ValueOf<T> = T[keyof T];

export type TableColumnPropPinned = 'left' | 'right';

export type TableRenderHeaderCell = (props: {
  title?: string;
  index: number;
}) => React.ReactElement | null;

export type TableRenderCell<T> = (props: {
  row: T;
  rowIndex: number;
  columnIndex: number;
}) => React.ReactElement | null;

type TabletColSpan<ROW> = (props: { row: ROW }) => number | 'end' | undefined;

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
  columns?: TableColumn<ROW>[];
  colSpan?: TabletColSpan<ROW>;
} & ValueOf<{
  [K in keyof ROW]: {
    accessor?: K extends string ? K : never;
  };
}>;

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

export type TableProps<ROW = TableDefaultRow> = PropsWithHTMLAttributesAndRef<
  {
    onRowMouseEnter?: TableRowMouseEvent<ROW>;
    onRowMouseLeave?: TableRowMouseEvent<ROW>;
    onRowClick?: TableRowMouseEvent<ROW>;
    stickyHeader?: boolean;
    virtualScroll?: boolean;
    resizable?: 'inside' | 'outside';
    columns: TableColumn<ROW>[];
    rows: ROW[];
    getRowKey?: (row: ROW) => string | number;
    zebraStriped?: boolean;
    headerZIndex?: number;
  },
  HTMLDivElement
>;

export type TableComponent = <ROW = TableDefaultRow>(
  props: TableProps<ROW>,
) => React.ReactElement | null;

export type TableHeaderProps<ROW = TableDefaultRow> =
  PropsWithHTMLAttributesAndRef<
    {
      headers: Header<ROW>[];
      stickyHeader?: boolean;
      stickyLeftOffsets: number[];
      stickyRightOffsets: number[];
      headerCellsRefs: React.RefObject<HTMLDivElement>[];
      borders: [boolean, boolean, boolean][];
    },
    HTMLDivElement
  >;

export type TableHeaderComponent = <ROW = TableDefaultRow>(
  props: TableHeaderProps<ROW>,
) => React.ReactElement | null;

export type TableBodyProps<ROW> = PropsWithHTMLAttributesAndRef<
  {
    topOffsets: number[];
    spaceTop: number;
    headerHeight: number;
    resizersRefs: React.RefObject<HTMLDivElement>[];
    header: React.ReactNode;
    body: React.ReactNode;
    resizable?: 'inside' | 'outside';
    stickyTopOffsets: number[];
    stickyHeader?: boolean;
    headerZIndex: number;
  },
  HTMLDivElement
> & {
  lowHeaders: TableColumn<ROW>[];
};

export type TableBodyComponent = <ROW>(
  props: TableBodyProps<ROW>,
) => React.ReactElement | null;

export type TableDataProps<ROW = TableDefaultRow> =
  PropsWithHTMLAttributesAndRef<
    {
      rowsRefs: React.Ref<HTMLDivElement>[];
      slice: [number, number];
      onRowMouseEnter?: TableRowMouseEvent<ROW>;
      onRowMouseLeave?: TableRowMouseEvent<ROW>;
      onRowClick?: TableRowMouseEvent<ROW>;
      getRowKey?: (row: ROW) => string | number;
    },
    HTMLDivElement
  > & {
    lowHeaders: TableColumn<ROW>[];
    rows: ROW[];
    zebraStriped?: boolean;
  };

export type TableDataComponent = <ROW = TableDefaultRow>(
  props: TableDataProps<ROW>,
) => React.ReactElement | null;
