import { IconArrowLeft } from '@consta/icons/IconArrowLeft';
import { IconArrowRight } from '@consta/icons/IconArrowRight';
import { useSelect } from '@consta/stand';
import { Button } from '@consta/uikit/Button';
import React from 'react';

import { Pagination } from '..';

const Variants = () => {
  return (
    <div style={{ width: '100%' }}>
      <Pagination totalLength={300} />
    </div>
  );
};

export default Variants;
