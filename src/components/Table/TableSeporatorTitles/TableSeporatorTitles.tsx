import './TableSeporatorTitles.css';

import { Text } from '@consta/uikit/Text';
import React from 'react';

import { cn } from '##/utils/bem';

import { TableColumn } from '../types';

type Props<T> = {
  lowHeaders: TableColumn<T>[];
};

const cnTableSeporatorTitles = cn('TableSeporatorTitles');

export const TableSeporatorTitles = <T,>({ lowHeaders }: Props<T>) => {
  if (
    lowHeaders.findIndex((column) => column.title && column.isSeparator) === -1
  ) {
    return null;
  }

  return (
    <div className={cnTableSeporatorTitles()}>
      {lowHeaders.map(({ title, isSeparator }, index) => (
        <div className={cnTableSeporatorTitles('Cell')} key={index}>
          {isSeparator && title && (
            <Text
              view="secondary"
              size="xs"
              className={cnTableSeporatorTitles('Title')}
            >
              {title}
            </Text>
          )}
        </div>
      ))}
    </div>
  );
};
