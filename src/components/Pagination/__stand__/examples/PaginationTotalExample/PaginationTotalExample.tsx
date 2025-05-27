import { Example } from '@consta/stand';
import React from 'react';

import { Pagination } from '../../..';

export const PaginationTotalExample = () => {
  return (
    <Example col={1}>
      <Pagination total={300} step={100} />
    </Example>
  );
};
