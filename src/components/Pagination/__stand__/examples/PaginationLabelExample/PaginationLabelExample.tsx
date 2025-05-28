import { Example } from '@consta/stand';
import React from 'react';

import { Pagination } from '../../..';

export const PaginationLabelExample = () => {
  return (
    <Example col={1}>
      <Pagination label="Показывать по:" />
    </Example>
  );
};
