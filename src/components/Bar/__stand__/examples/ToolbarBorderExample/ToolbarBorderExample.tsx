import { IconArrowLeft } from '@consta/icons/IconArrowLeft';
import { IconArrowRight } from '@consta/icons/IconArrowRight';
import { Example } from '@consta/stand';
import { Button } from '@consta/uikit/Button';
import React from 'react';

import { Toolbar, ToolbarProps } from '../../..';

const borders: Exclude<ToolbarProps['border'], undefined>[] = [
  'all',
  'top',
  'bottom',
];

export const ToolbarBorderExample = () => {
  return (
    <Example
      col={{ 1: 0, 2: 480 }}
      items={borders}
      getItemLabel={(border) => `border=${border}`}
      getItemNode={(border) => {
        return (
          <Toolbar
            border={border}
            form="brick"
            leftSide={<Button iconLeft={IconArrowLeft} view="ghost" />}
            rightSide={<Button iconRight={IconArrowRight} view="ghost" />}
          />
        );
      }}
    />
  );
};
