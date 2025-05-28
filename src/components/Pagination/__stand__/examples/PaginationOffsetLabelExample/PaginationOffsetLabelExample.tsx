import { Example } from '@consta/stand';
import React from 'react';

import { Pagination } from '../../..';

export const PaginationOffsetLabelExample = () => {
  return (
    <Example col={1}>
      <Pagination
        offsetLabel={(offset, step) =>
          `Элементы с ${offset + 1} по ${offset + step}`
        }
      />
    </Example>
  );
};
