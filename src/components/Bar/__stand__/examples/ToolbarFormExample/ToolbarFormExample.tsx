import { IconArrowLeft } from '@consta/icons/IconArrowLeft';
import { IconArrowRight } from '@consta/icons/IconArrowRight';
import { Example } from '@consta/stand';
import { Button } from '@consta/uikit/Button';
import React from 'react';

import { Toolbar, ToolbarProps } from '../../..';

const forms: Exclude<ToolbarProps['form'], undefined>[] = [
  'default',
  'brick',
  'brickDefault',
  'defaultBrick',
];

export const ToolbarFormExample = () => {
  return (
    <Example
      col={{ 1: 0, 2: 480 }}
      items={forms}
      getItemNode={(form) => {
        return (
          <Toolbar
            form={form}
            leftSide={<Button iconLeft={IconArrowLeft} view="ghost" />}
            rightSide={<Button iconRight={IconArrowRight} view="ghost" />}
          />
        );
      }}
    />
  );
};
