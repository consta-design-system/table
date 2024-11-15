import './DataNumberingCell.css';

import { cnMixFlex } from '@consta/uikit/MixFlex';
import { cnMixSpace } from '@consta/uikit/MixSpace';
import { Text } from '@consta/uikit/Text';
import React, { forwardRef } from 'react';

import { cn } from '##/utils/bem';

const cnDataNumberingCell = cn('DataNumberingCell');

export type DataNumberingCellProps = {
  children: React.ReactNode;
} & JSX.IntrinsicElements['div'];

export const DataNumberingCell = forwardRef<
  HTMLDivElement,
  DataNumberingCellProps
>((props, ref) => {
  const { children, className } = props;
  return (
    <Text
      ref={ref}
      className={cnDataNumberingCell(null, [
        cnMixSpace({ pV: '3xs' }),
        cnMixFlex({ flex: 'flex', align: 'center', justify: 'center' }),
        className,
      ])}
      size="xs"
      lineHeight="l"
      view="secondary"
    >
      {children}
    </Text>
  );
});
