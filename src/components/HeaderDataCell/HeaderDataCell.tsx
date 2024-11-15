import './HeaderDataCell.css';

import { cnMixFlex } from '@consta/uikit/MixFlex';
import { cnMixSpace } from '@consta/uikit/MixSpace';
import { Text } from '@consta/uikit/Text';
import React, { forwardRef, Fragment } from 'react';

import { cn } from '##/utils/bem';
import { cellVerticalSpaceMap } from '##/utils/maps/cellVerticalSpaceMap';
import { isNumber, isString } from '##/utils/type-guards';

const cnHeaderDataCell = cn('HeaderDataCell');

export type HeaderDataCellProps = {
  controlRight?: React.ReactNode | JSX.Element[];
  controlLeft?: React.ReactNode | JSX.Element[];
  children?: React.ReactNode | JSX.Element[];
  size?: 'm' | 's';
} & JSX.IntrinsicElements['div'];

const renderContentSlot = (children: HeaderDataCellProps['children']) => (
  <div
    className={cnHeaderDataCell('ContentSlot', [
      cnMixFlex({
        flex: 'flex',
        align: 'center',
      }),
    ])}
  >
    {children}
  </div>
);

const renderChildren = (
  children: HeaderDataCellProps['children'],
  size: 'm' | 's',
) => {
  if (isString(children) || isNumber(children)) {
    return renderContentSlot(
      <Text
        className={cnMixSpace({
          pV: cellVerticalSpaceMap[size],
        })}
        size={size}
      >
        {children}
      </Text>,
    );
  }
  return renderContentSlot(children);
};

export const HeaderDataCell = forwardRef<HTMLDivElement, HeaderDataCellProps>(
  (props, ref) => {
    const {
      className,
      size = 'm',
      controlRight,
      children,
      controlLeft,
    } = props;

    const childrenSlots = children
      ? [
          ...(Array.isArray(children)
            ? children.map((item) => renderChildren(item, size))
            : [renderChildren(children, size)]),
        ]
      : [];

    const controlRightSlots = controlRight
      ? [...(Array.isArray(controlRight) ? controlRight : [controlRight])]
      : [];

    const controlLeftSlots = controlLeft
      ? [...(Array.isArray(controlLeft) ? controlLeft : [controlLeft])]
      : [];

    return (
      <div
        className={cnHeaderDataCell({ size }, [
          cnMixFlex({ flex: 'flex', gap: 'xs', justify: 'space-between' }),
          cnMixSpace({ pH: 's' }),
          className,
        ])}
        ref={ref}
      >
        <div className={cnMixFlex({ flex: 'flex', gap: 'xs' })}>
          {controlLeftSlots.length ? (
            <div className={cnMixFlex({ flex: 'flex', gap: '2xs' })}>
              {controlLeftSlots.map((item, index) => (
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
          {childrenSlots.length ? (
            <div className={cnMixFlex({ flex: 'flex', gap: '2xs' })}>
              {childrenSlots.map((item, index) => (
                <Fragment key={index}>{item}</Fragment>
              ))}
            </div>
          ) : undefined}
        </div>
        {controlRightSlots.length ? (
          <div
            className={cnMixFlex({
              flex: 'flex',
              align: 'center',
              gap: '2xs',
            })}
          >
            {controlRightSlots.map((item, index) => (
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
