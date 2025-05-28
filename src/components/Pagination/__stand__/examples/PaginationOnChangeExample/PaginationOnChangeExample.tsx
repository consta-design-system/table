import { Example } from '@consta/stand';
import { Text } from '@consta/uikit/Text';
import React, { useState } from 'react';

import { Pagination } from '../../..';

export const PaginationOnChangeExample = () => {
  const [offset, setOffset] = useState(0);
  return (
    <Example col={1}>
      <Pagination offset={offset} onChange={setOffset} />
      <Text>Пропущено элементов — {offset}</Text>
    </Example>
  );
};
