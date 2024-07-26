import { IconDinosaur } from '@consta/icons/IconDinosaur';
import { Example } from '@consta/stand';
import React from 'react';

import { DataCell, DataCellProps } from '##/components/DataCell';

const items: Exclude<DataCellProps['view'], undefined>[] = [
  'alert',
  'primary',
  'success',
  'warning',
];

export const DataCellExampleView = () => (
  <Example
    col={{ 1: 0, 2: 500, 4: 600 }}
    items={items}
    getItemLabel={(view) => `view = ${view}`}
    getItemNode={(view) => (
      <DataCell icon={IconDinosaur} view={view}>
        Текст
      </DataCell>
    )}
  />
);
