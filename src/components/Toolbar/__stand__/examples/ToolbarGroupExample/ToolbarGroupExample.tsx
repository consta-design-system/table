import { IconAdd } from '@consta/icons/IconAdd';
import { IconCommentAddFilled } from '@consta/icons/IconCommentAddFilled';
import { IconCommentDeleteFilled } from '@consta/icons/IconCommentDeleteFilled';
import { IconCommentEditFilled } from '@consta/icons/IconCommentEditFilled';
import { IconCopy } from '@consta/icons/IconCopy';
import { IconEdit } from '@consta/icons/IconEdit';
import { IconFunnel } from '@consta/icons/IconFunnel';
import { IconKebab } from '@consta/icons/IconKebab';
import { IconSearchStroked } from '@consta/icons/IconSearchStroked';
import { IconSelect } from '@consta/icons/IconSelect';
import { IconTrash } from '@consta/icons/IconTrash';
import { Example } from '@consta/stand';
import { Button } from '@consta/uikit/Button';
import { FieldGroup } from '@consta/uikit/FieldGroup';
import { cnMixSpace } from '@consta/uikit/MixSpace';
import { TextField } from '@consta/uikit/TextFieldCanary';
import React from 'react';

import { Toolbar, ToolbarDivider } from '../../..';

export const ToolbarGroupExample = () => {
  return (
    <Example col={1}>
      <Toolbar
        itemsGap={['s', 0]}
        leftSide={[
          <TextField
            size="s"
            placeholder="Найти"
            style={{ width: 180 }}
            leftSide={IconSearchStroked}
          />,
          <Button iconLeft={IconFunnel} view="ghost" size="s" />,
        ]}
        rightSide={[
          <Button iconLeft={IconEdit} size="s" view="clear" />,
          <Button iconLeft={IconCopy} size="s" view="clear" />,
          <Button iconLeft={IconTrash} size="s" view="clear" />,
          <ToolbarDivider className={cnMixSpace({ mH: '2xs' })} />,
          <Button iconLeft={IconCommentAddFilled} size="s" view="clear" />,
          <Button iconLeft={IconCommentEditFilled} size="s" view="clear" />,
          <Button iconLeft={IconCommentDeleteFilled} size="s" view="clear" />,
          <ToolbarDivider className={cnMixSpace({ mH: '2xs' })} />,
          <Button iconLeft={IconKebab} size="s" view="clear" />,
          <div className={cnMixSpace({ mL: '2xs' })} />,
          <FieldGroup size="s">
            <Button iconLeft={IconAdd} />
            <Button iconLeft={IconSelect} />
          </FieldGroup>,
        ]}
      />
    </Example>
  );
};
