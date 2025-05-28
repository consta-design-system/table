import { IconArrowLeft } from '@consta/icons/IconArrowLeft';
import { IconArrowRight } from '@consta/icons/IconArrowRight';
import { useSelect } from '@consta/stand';
import { Button } from '@consta/uikit/Button';
import React from 'react';

import { Toolbar, ToolbarProps } from '..';

const Variants = () => {
  const form: ToolbarProps['form'] = useSelect(
    'form',
    ['default', 'brick', 'brickDefault', 'defaultBrick'],
    'default',
  );

  const border: ToolbarProps['border'] = useSelect('border', [
    'all',
    'top',
    'bottom',
  ]);

  return (
    <div style={{ width: '100%' }}>
      <Toolbar
        form={form}
        leftSide={[
          <Button iconLeft={IconArrowLeft} view="ghost" />,
          <Button iconLeft={IconArrowRight} view="ghost" />,
        ]}
        rightSide={<Button label="Применить" />}
        border={border}
      />
    </div>
  );
};

export default Variants;
