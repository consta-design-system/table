import './DataCell.css';

import { IconComponent } from '@consta/icons/Icon';
import { cnMixFlex } from '@consta/uikit/MixFlex';
import { cnMixSpace, Space } from '@consta/uikit/MixSpace';
import { Text } from '@consta/uikit/Text';
import React, { forwardRef } from 'react';

import { cn } from '##/utils/bem';
import { isNotNil, isNumber, isString } from '##/utils/type-guards';

const cnDataCell = cn('DataCell');

export type DataCellProps = {
  control?: React.ReactNode | JSX.Element[];
  icon?: IconComponent | IconComponent[];
  children?: React.ReactNode | JSX.Element[];
  level?: number;
  view?: 'primary' | 'alert' | 'success' | 'warning';
  size?: 'm' | 's';
  indicator?: 'alert' | 'warning';
} & JSX.IntrinsicElements['div'];

const renderIcon = (Icon: IconComponent, view: DataCellProps['view']) => (
  <Icon view={view} size="s" />
);

const renderChildren = (
  children: DataCellProps['children'],
  view: DataCellProps['view'],
  size: DataCellProps['size'],
) => {
  if (isString(children) || isNumber(children)) {
    return (
      <Text view={view} size={size}>
        {children}
      </Text>
    );
  }
  return children;
};

const contentHorisontalSpaseMap: Record<
  Exclude<DataCellProps['size'], undefined>,
  Space
> = {
  m: 'm',
  s: 'xs',
};

const contentVerticalSpaseMap: Record<
  Exclude<DataCellProps['size'], undefined>,
  Space
> = {
  m: 's',
  s: 'xs',
};

export const DataCell = forwardRef<HTMLDivElement, DataCellProps>(
  (props, ref) => {
    const {
      className,
      control,
      icon,
      children,
      level: levelProp = 0,
      view,
      size = 'm',
      indicator,
    } = props;
    const level = levelProp < 0 ? 0 : levelProp;

    const controlsSlots = control
      ? [...(Array.isArray(control) ? control : [control])]
      : [];

    const iconsSlots = icon
      ? [
          ...(Array.isArray(icon)
            ? icon.map((icon) => renderIcon(icon, view))
            : [renderIcon(icon, view)]),
        ]
      : [];

    const childrenSlots = children
      ? [
          ...(Array.isArray(children)
            ? children.map((item) => renderChildren(item, view, size))
            : [renderChildren(children, view, size)]),
        ]
      : [];

    const contentSlots = [...iconsSlots, ...childrenSlots];

    return (
      <div
        className={cnDataCell({ size, indicator: Boolean(indicator) }, [
          cnMixFlex({ flex: 'flex' }),
          className,
        ])}
        style={{
          ['--table-data-cell-level' as string]: level || undefined,
          ['--table-data-cell-indicator-color' as string]: indicator
            ? `var(--color-bg-${indicator})`
            : undefined,
        }}
        ref={ref}
      >
        {controlsSlots.length ? (
          <div
            className={cnDataCell('Controls', [
              cnMixFlex({ flex: 'flex', align: 'center' }),
            ])}
          >
            {controlsSlots.map((item, index) => {
              if (isNotNil(item)) {
                return (
                  <div
                    className={cnDataCell('ControlSlot', [
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
                );
              }
            })}
          </div>
        ) : undefined}
        {contentSlots.length ? (
          <div
            className={cnDataCell('Content', [
              cnMixFlex({ flex: 'flex', gap: '2xs' }),
              cnMixSpace({
                pH: contentHorisontalSpaseMap[size],
                pV: contentVerticalSpaseMap[size],
              }),
            ])}
          >
            {contentSlots.map((item, index) => {
              if (isNotNil(item)) {
                return (
                  <div
                    className={cnDataCell('ContentSlot', [
                      cnMixFlex({
                        flex: 'flex',
                        align: 'center',
                      }),
                    ])}
                    key={index}
                  >
                    {item}
                  </div>
                );
              }
            })}
          </div>
        ) : undefined}
      </div>
    );
  },
);
