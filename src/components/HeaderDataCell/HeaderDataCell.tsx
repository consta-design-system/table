import './HeaderDataCell.css';

import { cnMixFlex } from '@consta/uikit/MixFlex';
import { cnMixSpace } from '@consta/uikit/MixSpace';
import { Text } from '@consta/uikit/Text';
import React, { forwardRef } from 'react';

import { cn } from '##/utils/bem';
import { isNumber, isString } from '##/utils/type-guards';

const cnHeaderDataCell = cn('HeaderDataCell');

export type HeaderDataCellProps = {
  control?: React.ReactNode | JSX.Element[];
  children?: React.ReactNode | JSX.Element[];
  size?: 'm' | 's';
} & JSX.IntrinsicElements['div'];

const renderChildren = (
  children: HeaderDataCellProps['children'],
  size: HeaderDataCellProps['size'],
) => {
  if (isString(children) || isNumber(children)) {
    return <Text size={size}>{children}</Text>;
  }
  return children;
};

export const HeaderDataCell = forwardRef<HTMLDivElement, HeaderDataCellProps>(
  (props, ref) => {
    const { className, size = 'm', control, children } = props;

    const childrenSlots = children
      ? [
          ...(Array.isArray(children)
            ? children.map((item) => renderChildren(item, size))
            : [renderChildren(children, size)]),
        ]
      : [];

    const controlsSlots = control
      ? [...(Array.isArray(control) ? control : [control])]
      : [];

    return (
      <div
        className={cnHeaderDataCell({ size }, [
          cnMixFlex({ flex: 'flex', gap: 'xs', justify: 'space-between' }),
          cnMixSpace({ pL: 'm', pR: 's', pV: 'xs' }),
          className,
        ])}
        ref={ref}
      >
        {childrenSlots.length ? (
          <div
            className={cnMixFlex({
              flex: 'flex',
              gap: '2xs',
            })}
          >
            {childrenSlots.map((item, index) => (
              <div
                className={cnHeaderDataCell('ContentSlot', [
                  cnMixFlex({
                    flex: 'flex',
                    align: 'center',
                  }),
                ])}
                key={index}
              >
                {item}
              </div>
            ))}
          </div>
        ) : undefined}
        {controlsSlots.length ? (
          <div
            className={cnMixFlex({
              flex: 'flex',
            })}
          >
            {controlsSlots.map((item, index) => (
              <div
                className={cnHeaderDataCell('ControlSlot', [
                  cnMixFlex({
                    flex: 'flex',
                    align: 'center',
                    justify: 'center',
                  }),
                ])}
                key={index}
              >
                {item}
              </div>
            ))}
          </div>
        ) : undefined}
      </div>
    );
  },
);
