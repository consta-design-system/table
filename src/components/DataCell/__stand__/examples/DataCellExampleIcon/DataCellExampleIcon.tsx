import { IconDinosaur } from '@consta/icons/IconDinosaur';
import { Example } from '@consta/stand';
import React from 'react';

import { DataCell } from '##/components/DataCell';

export const DataCellExampleIcon = () => (
  <Example col={1}>
    <DataCell icon={IconDinosaur}>Текст</DataCell>
  </Example>
);
