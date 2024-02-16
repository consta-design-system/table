import React, { forwardRef } from 'react';

import { prepareColumns } from './helpers';
import { TableHeader } from './TableHeader/TableHeader';
import { TableComponent, TableProps } from './types';

export const TableRender = <T,>(
  props: TableProps<T>,
  ref: React.Ref<HTMLDivElement>,
) => {
  const { columns } = props;

  console.log(prepareColumns(columns));

  return <TableHeader columns={columns} />;
};

export const Table = forwardRef(TableRender) as TableComponent;
