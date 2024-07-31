import { IconDinosaur } from '@consta/icons/IconDinosaur';
import { Example } from '@consta/stand';
import React from 'react';

import { DataCell, DataCellProps } from '##/components/DataCell';

const items: Exclude<DataCellProps['size'], undefined>[] = ['m', 's'];

export const DataCellExampleSize = () => (
  <Example
    col={{ 1: 0, 2: 600 }}
    items={items}
    getItemLabel={(size) => `size = ${size}`}
    getItemNode={(size) => (
      <DataCell icon={IconDinosaur} size={size}>
        Текст
      </DataCell>
    )}
  />
);
