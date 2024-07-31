import { Example } from '@consta/stand';
import React from 'react';

import {
  HeaderDataCell,
  HeaderDataCellProps,
} from '##/components/HeaderDataCell';

const items: Exclude<HeaderDataCellProps['size'], undefined>[] = ['m', 's'];

export const HeaderDataCellExampleSize = () => (
  <Example
    col={{ 1: 0, 2: 600 }}
    items={items}
    getItemLabel={(size) => `size = ${size}`}
    getItemNode={(size) => <HeaderDataCell size={size}>Текст</HeaderDataCell>}
  />
);
