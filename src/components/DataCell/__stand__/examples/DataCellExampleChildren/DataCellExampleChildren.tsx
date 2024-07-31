import { Example } from '@consta/stand';
import { Badge } from '@consta/uikit/Badge';
import React from 'react';

import { DataCell } from '##/components/DataCell';

const items = [
  {
    label: 'Число',
    content: 100,
  },
  {
    label: 'Текст',
    content: 'Текст',
  },
  {
    label: 'Текс и бейджик',
    content: ['Текст', <Badge size="s" label="Бейдж" />],
  },
];

export const DataCellExampleChildren = () => (
  <Example
    col={{ 1: 0, 3: 600 }}
    items={items}
    getItemNode={({ content }) => <DataCell>{content}</DataCell>}
  />
);
