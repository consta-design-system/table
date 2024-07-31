import { IconArrowDown } from '@consta/icons/IconArrowDown';
import { Example } from '@consta/stand';
import { Button } from '@consta/uikit/Button';
import { Checkbox } from '@consta/uikit/Checkbox';
import React from 'react';

import { DataCell } from '##/components/DataCell';

const items = [
  {
    label: 'Один контрол',
    content: <Checkbox size="s" checked />,
  },
  {
    label: 'Два контрола',
    content: [
      <Button view="clear" iconLeft={IconArrowDown} onlyIcon size="s" />,
      <Checkbox size="s" checked />,
    ],
  },
];

export const DataCellExampleControls = () => (
  <Example
    col={{ 1: 0, 2: 600 }}
    items={items}
    getItemNode={({ content }) => <DataCell control={content}>Текст</DataCell>}
  />
);
