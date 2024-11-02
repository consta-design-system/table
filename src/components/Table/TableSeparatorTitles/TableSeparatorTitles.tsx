import './TableSeparatorTitles.css';

import { Text } from '@consta/uikit/Text';
import React from 'react';

import { cn } from '##/utils/bem';

import { TableColumn } from '../types';

type Props<T> = {
  lowHeaders: TableColumn<T>[];
};

const cnTableSeparatorTitles = cn('TableSeparatorTitles');

export const TableSeparatorTitles = <T,>({ lowHeaders }: Props<T>) => {
  if (
    lowHeaders.findIndex((column) => column.title && column.isSeparator) === -1
  ) {
    return null;
  }

  return (
    <div className={cnTableSeparatorTitles()}>
      {lowHeaders.map(({ title, isSeparator }, index) => (
        <div className={cnTableSeparatorTitles('Cell')} key={index}>
          {isSeparator && title && (
            <Text
              view="secondary"
              size="xs"
              className={cnTableSeparatorTitles('Title')}
            >
              {title}
            </Text>
          )}
        </div>
      ))}
    </div>
  );
};
