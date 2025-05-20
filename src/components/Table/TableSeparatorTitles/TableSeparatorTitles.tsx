import './TableSeparatorTitles.css';

import { Text } from '@consta/uikit/Text';
import { AtomMut } from '@reatom/core';
import { useAtom } from '@reatom/npm-react';
import React, { memo } from 'react';

import { cn } from '##/utils/bem';

import { TableColumn } from '../types';

type Props<T> = {
  lowHeadersAtom: AtomMut<TableColumn<T>[]>;
};

type TableSeparatorTitlesComponent = <T>(
  props: Props<T>,
) => React.ReactElement | null;

const cnTableSeparatorTitles = cn('TableSeparatorTitles');

export const TableSeparatorTitles: TableSeparatorTitlesComponent = memo(
  ({ lowHeadersAtom }) => {
    const [lowHeaders] = useAtom(lowHeadersAtom);
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
  },
  () => true,
);
