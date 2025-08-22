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

import { Filter } from '..';

const items: string[] = [
  'первый',
  'второй',
  'третий',
  'четвертый',
  'пятый',
  'шестой',
  'седьмой',
  'восьмой',
];

const Variants = () => {
  return (
    <div style={{ width: '100%' }}>
      <Filter
        items={items}
        inputPlaceholder="Поиск"
        footer={[
          <Button label="Сбросить" size="xs" view="ghost" />,
          <Button label="Применить" size="xs" />,
        ]}
      />
    </div>
  );
};

export default Variants;
