import { IconAdd } from '@consta/icons/IconAdd';
import { IconFunnel } from '@consta/icons/IconFunnel';
import { IconKebab } from '@consta/icons/IconKebab';
import { IconSearchStroked } from '@consta/icons/IconSearchStroked';
import { IconSelect } from '@consta/icons/IconSelect';
import { Example } from '@consta/stand';
import { Button } from '@consta/uikit/Button';
import { FieldGroup } from '@consta/uikit/FieldGroup';
import { TextField } from '@consta/uikit/TextFieldCanary';
import React from 'react';

import { Toolbar } from '../../..';

export const ToolbarSpaceExample = () => {
  return (
    <Example col={1}>
      <Toolbar
        border
        space={{ p: 'm' }}
        itemsGap="m"
        leftSide={[
          <TextField
            size="m"
            placeholder="Найти"
            style={{ width: 180 }}
            leftSide={IconSearchStroked}
          />,
          <Button iconLeft={IconFunnel} view="ghost" size="m" />,
        ]}
        rightSide={[
          <Button iconLeft={IconKebab} size="m" view="clear" />,
          <FieldGroup size="m">
            <Button iconLeft={IconAdd} />
            <Button iconLeft={IconSelect} />
          </FieldGroup>,
        ]}
      />
    </Example>
  );
};
