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

export const ToolbarContentExample = () => {
  return (
    <Example col={1}>
      <Toolbar
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
      />
    </Example>
  );
};
