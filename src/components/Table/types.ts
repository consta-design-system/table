import { PropsWithHTMLAttributesAndRef } from '@consta/uikit/__internal__/src/utils/types/PropsWithHTMLAttributes';

export type ValueOf<T> = T[keyof T];

export type TableColumn<ROW> = {
  title: string;
  width?: number;
  hidden?: boolean;
  renderHeaderCell?: (title: string) => React.ReactElement | null;
  columns?: TableColumn<ROW>[];
} & (
  | { columns: TableColumn<ROW>[] }
  | { renderCell: (row: ROW) => React.ReactElement | null }
  | ValueOf<{
      [K in keyof ROW]: {
        accessor: K extends string ? K : never;
      };
    }>
);

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
    columns: TableColumn<ROW>[];
  },
  HTMLDivElement
>;

export type TableHeaderComponent = <ROW>(
  props: TableHeaderProps<ROW>,
) => React.ReactElement | null;
