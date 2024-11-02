import { useText } from '@consta/stand';
import React from 'react';

import { DataNumberingCell } from '..';

const Variants = () => {
  const children = useText('children', 'A');
  return <DataNumberingCell>{children}</DataNumberingCell>;
};

export default Variants;
