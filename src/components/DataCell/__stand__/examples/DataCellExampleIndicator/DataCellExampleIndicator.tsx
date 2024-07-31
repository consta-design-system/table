import { Example } from '@consta/stand';
import React from 'react';

import { DataCell, DataCellProps } from '##/components/DataCell';

const items: Exclude<DataCellProps['indicator'], undefined>[] = [
  'alert',
  'warning',
];

export const DataCellExampleIndicator = () => (
  <Example
    col={{ 1: 0, 2: 600 }}
    items={items}
    getItemLabel={(indicator) => `indicator = ${indicator}`}
    getItemNode={(indicator) => (
      <DataCell indicator={indicator}>Текст</DataCell>
    )}
  />
);
