import { PropsWithHTMLAttributesAndRef } from '@consta/uikit/__internal__/src/utils/types/PropsWithHTMLAttributes';

export type ValueOf<T> = T[keyof T];

export type TableColumn<ROW> = {
  columns?: TableColumn<ROW>[];
  title: string;
  width?: number;
  hidden?: boolean;
  renderHeaderCell?: (title: string) => React.ReactElement | null;
} & ValueOf<{
  [K in keyof ROW]: {
    accessor?: K extends string ? K : never;
  };
}>;

export type Header<ROW> = TableColumn<ROW> & {
  position: Position;
  colId?: number;
  parentId?: number;
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
export type TableRowMouseEvent<ROW> = (row: ROW, e: React.MouseEvent) => void;

export type TableProps<ROW> = PropsWithHTMLAttributesAndRef<
  {
    columns: TableColumn<ROW>[];
    rows: ROW[];
    onRowMouseEnter?: TableRowMouseEvent<ROW>;
    onRowMouseLeave?: TableRowMouseEvent<ROW>;
    onRowMouseClick?: TableRowMouseEvent<ROW>;
  },
  HTMLDivElement
>;

export type TableComponent = <ROW>(
  props: TableProps<ROW>,
) => React.ReactElement | null;

export type TableHeaderProps<ROW> = PropsWithHTMLAttributesAndRef<
  {
    headers: Header<ROW>[];
    headerRowsRefs: React.MutableRefObject<
      Record<number, HTMLDivElement | null>
    >;
    headerRowsHeights: Array<number>;
  },
  HTMLDivElement
>;

export type TableHeaderComponent = <ROW>(
  props: TableHeaderProps<ROW>,
) => React.ReactElement | null;

export type TableBodyProps = PropsWithHTMLAttributesAndRef<
  {
    columnsWidths: (string | number | undefined)[];
  },
  HTMLDivElement
>;

export type TableBodyComponent = (
  props: TableBodyProps,
) => React.ReactElement | null;

export type TableDataProps<ROW> = PropsWithHTMLAttributesAndRef<
  {
    lowHeaders: Array<Header<ROW>>;
    rows: ROW[];
    onRowMouseEnter?: TableRowMouseEvent<ROW>;
    onRowMouseLeave?: TableRowMouseEvent<ROW>;
    onRowMouseClick?: TableRowMouseEvent<ROW>;
    rowsRefs: React.Ref<HTMLDivElement>[];
    headerColumnsHeights: Array<number>;
    slice: [number, number];
    setBoundaryRef: (
      columnIdx: number,
      rowIdx: number,
    ) => React.RefObject<HTMLDivElement> | undefined;
  },
  HTMLDivElement
>;

export type TableDataComponent = <ROW>(
  props: TableDataProps<ROW>,
) => React.ReactElement | null;
