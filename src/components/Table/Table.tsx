import React, { forwardRef } from 'react';

import { TableComponent, TableProps } from './types';

export const TableRender = <T,>(
  props: TableProps<T>,
  ref: React.Ref<HTMLDivElement>,
) => {
  return <div />;
};

export const Table = forwardRef(TableRender) as TableComponent;
