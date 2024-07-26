import './DataCellExampleLevel.css';

import { IconArrowUp } from '@consta/icons/IconArrowUp';
import { Example } from '@consta/stand';
import { Button } from '@consta/uikit/Button';
import React from 'react';

import { DataCell } from '##/components/DataCell';
import { cn } from '##/utils/bem';

const cnDataCellExampleLevel = cn('DataCellExampleLevel');

const ButtonWithButton = () => (
  <Button onlyIcon iconLeft={IconArrowUp} view="clear" size="s" />
);

export const DataCellExampleLevel = () => (
  <Example col={1}>
    <div>
      {[0, 1, 2, 3].map((level) => (
        <DataCell
          className={cnDataCellExampleLevel('Cell')}
          level={level}
          control={<ButtonWithButton />}
        >
          Уровень вложенности {level}
        </DataCell>
      ))}
    </div>
  </Example>
);
