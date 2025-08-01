import { IconAdd } from '@consta/icons/IconAdd';
import { IconFunnel } from '@consta/icons/IconFunnel';
import { IconKebab } from '@consta/icons/IconKebab';
import { IconSearchStroked } from '@consta/icons/IconSearchStroked';
import { IconSelect } from '@consta/icons/IconSelect';
import { useSelect } from '@consta/stand';
import { Button } from '@consta/uikit/Button';
import { FieldGroup } from '@consta/uikit/FieldGroup';
import { Space } from '@consta/uikit/MixSpace';
import { TextField } from '@consta/uikit/TextFieldCanary';
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
  ] as const);

  const itemsGap = useSelect<Space>(
    'itemsGap',
    [
      0,
      '3xs',
      '2xs',
      'xs',
      's',
      'm',
      'l',
      'xl',
      '2xl',
      '3xl',
      '4xl',
      '5xl',
      '6xl',
    ],
    's',
  );

  return (
    <div style={{ width: '100%' }}>
      <Toolbar
        form={form}
        leftSide={[
          <TextField
            size="s"
            placeholder="Найти"
            style={{ width: 150 }}
            leftSide={IconSearchStroked}
          />,
          <Button iconLeft={IconFunnel} view="ghost" size="s" />,
        ]}
        rightSide={[
          <Button iconLeft={IconKebab} size="s" view="clear" />,
          <FieldGroup size="s">
            <Button iconLeft={IconAdd} />
            <Button iconLeft={IconSelect} />
          </FieldGroup>,
        ]}
        border={border}
        itemsGap={itemsGap}
      />
    </div>
  );
};

export default Variants;
