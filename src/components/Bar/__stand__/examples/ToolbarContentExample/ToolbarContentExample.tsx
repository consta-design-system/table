import { IconArrowLeft } from '@consta/icons/IconArrowLeft';
import { IconArrowRight } from '@consta/icons/IconArrowRight';
import { Example } from '@consta/stand';
import { Button } from '@consta/uikit/Button';
import React from 'react';

import { Toolbar } from '../../..';

export const ToolbarContentExample = () => {
  return (
    <Example col={1}>
      <Toolbar
        leftSide={[
          <Button iconLeft={IconArrowLeft} view="ghost" />,
          <Button iconLeft={IconArrowRight} view="ghost" />,
        ]}
        rightSide={<Button label="Применить" />}
      />
    </Example>
  );
};
