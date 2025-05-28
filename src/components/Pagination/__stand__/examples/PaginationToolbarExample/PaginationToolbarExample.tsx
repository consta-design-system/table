import { Example } from '@consta/stand';
import React from 'react';

import { Toolbar } from '##/components/Toolbar';

import { Pagination } from '../../..';

export const PaginationToolbarExample = () => {
  return (
    <Example col={1}>
      <Toolbar form="brickDefault" rightSide={<Pagination total={300} />} />
    </Example>
  );
};
