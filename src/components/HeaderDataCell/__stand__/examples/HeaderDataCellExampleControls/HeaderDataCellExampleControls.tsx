import { IconFunnel } from '@consta/icons/IconFunnel';
import { IconKebab } from '@consta/icons/IconKebab';
import { IconUnsort } from '@consta/icons/IconUnsort';
import { Example } from '@consta/stand';
import { Button } from '@consta/uikit/Button';
import React from 'react';

import { HeaderDataCell } from '##/components/HeaderDataCell';

export const HeaderDataCellExampleControls = () => (
  <Example>
    <HeaderDataCell
      controlRight={[
        <Button view="clear" iconLeft={IconUnsort} onlyIcon size="s" />,
        <Button view="clear" iconLeft={IconFunnel} onlyIcon size="s" />,
        <Button view="clear" iconLeft={IconKebab} onlyIcon size="s" />,
      ]}
    >
      Текст
    </HeaderDataCell>
  </Example>
);
