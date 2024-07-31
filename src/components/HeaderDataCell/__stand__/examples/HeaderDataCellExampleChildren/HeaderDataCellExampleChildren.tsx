import { IconArrowLeft } from '@consta/icons/IconArrowLeft';
import { Example } from '@consta/stand';
import { Button } from '@consta/uikit/Button';
import React from 'react';

import { HeaderDataCell } from '##/components/HeaderDataCell';

const items = [
  {
    label: 'Текст',
    content: 'Текст',
  },
  {
    label: 'Текс и кнопка',
    content: [
      'Текст',
      <Button view="clear" iconLeft={IconArrowLeft} onlyIcon size="s" />,
    ],
  },
];

export const HeaderDataCellExampleChildren = () => (
  <Example
    col={{ 1: 0, 2: 600 }}
    items={items}
    getItemNode={({ content }) => <HeaderDataCell>{content}</HeaderDataCell>}
  />
);
