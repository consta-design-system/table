import './TableSeparatorTitles.css';

import { Text } from '@consta/uikit/Text';
import { AtomLike } from '@reatom/core';
import { reatomFactoryComponent } from '@reatom/react';
import React, { memo } from 'react';

import { cn } from '##/utils/bem';

import { TableColumn } from '../types';

type Props<T> = {
  lowHeadersAtom: AtomLike<TableColumn<T>[]>;
};

type TableSeparatorTitlesComponent = <T>(
  props: Props<T>,
) => React.ReactNode | null;

const cnTableSeparatorTitles = cn('TableSeparatorTitles');

export const TableSeparatorTitles: TableSeparatorTitlesComponent = memo(
  reatomFactoryComponent(() => ({ lowHeadersAtom }) => {
    const lowHeaders = lowHeadersAtom();

    if (
      lowHeaders.findIndex((column) => column.title && column.isSeparator) ===
      -1
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
  }),
  () => true,
);
