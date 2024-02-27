import React, { forwardRef } from 'react';

import { getMaxLevel, transformColumns } from './helpers';
import { TableBody } from './TableBody';
import { TableHeader } from './TableHeader/TableHeader';
import { TableColumn, TableComponent, TableProps } from './types';

export const TableRender = <T,>(
  props: TableProps<T>,
  ref: React.Ref<HTMLDivElement>,
) => {
  const { columns } = props;

  // const [columsWithWidth] = prepareColumns(columns);
  console.log(transformColumns(columns, getMaxLevel(columns)));

  // traversal(columns, 'columns', console.log);

  return (
    <TableBody columns={[]}>
      <TableHeader columns={[]} />
    </TableBody>
  );
};

export const Table = forwardRef(TableRender) as TableComponent;
