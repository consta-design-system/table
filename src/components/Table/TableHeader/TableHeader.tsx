import React, { forwardRef } from 'react';

import { TableHeaderComponent, TableHeaderProps } from '../types';

export const TableHeaderRender = <T,>(
  props: TableHeaderProps<T>,
  ref: React.Ref<HTMLDivElement>,
) => {
  return <div />;
};

export const TableHeader = forwardRef(
  TableHeaderRender,
) as TableHeaderComponent;
