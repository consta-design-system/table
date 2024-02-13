import './TableVirtualScrollSpaceTop.css';

import React from 'react';

import { cn } from '##/utils/bem';

const cnTableVirtualScrollSpaceTop = cn('TableVirtualScrollSpaceTop');

export const TableVirtualScrollSpaceTop: React.FC = () => {
  return <div className={cnTableVirtualScrollSpaceTop()} />;
};
