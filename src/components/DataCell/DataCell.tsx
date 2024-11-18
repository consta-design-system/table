import './DataCell.css';

import { IconComponent } from '@consta/icons/Icon';
import { cnMixFlex } from '@consta/uikit/MixFlex';
import { cnMixSpace } from '@consta/uikit/MixSpace';
import { Text } from '@consta/uikit/Text';
import React, { forwardRef, Fragment } from 'react';

import { cn } from '##/utils/bem';
import { cellVerticalSpaceMap } from '##/utils/maps/cellVerticalSpaceMap';
import { isNumber, isString } from '##/utils/type-guards';

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

const renderContentSlot = (children: DataCellProps['children']) => (
  <div
    className={cnDataCell('ContentSlot', [
      cnMixFlex({
        flex: 'flex',
        align: 'center',
      }),
    ])}
  >
    {children}
  </div>
);

const renderIcon = (Icon: IconComponent, view: DataCellProps['view']) =>
  renderContentSlot(<Icon view={view} size="s" />);

const renderChildren = (
  children: DataCellProps['children'],
  view: DataCellProps['view'],
  size: 'm' | 's',
) => {
  if (isString(children) || isNumber(children)) {
    return renderContentSlot(
      <Text
        className={cnMixSpace({
          pV: cellVerticalSpaceMap[size],
        })}
        view={view}
        size={size}
      >
        {children}
      </Text>,
    );
  }
  return renderContentSlot(children);
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
      style,
      ...otherProps
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
        {...otherProps}
        className={cnDataCell(
          {
            size,
            indicator: Boolean(indicator),
            alignmentIndent: level >= 1 && controlsSlots.length === 0,
          },
          [cnMixFlex({ flex: 'flex' }), className],
        )}
        style={{
          ...style,
          ['--table-data-cell-level' as string]: level || undefined,
          ['--table-data-cell-indicator-color' as string]: indicator
            ? `var(--color-bg-${indicator})`
            : undefined,
        }}
        ref={ref}
      >
        {controlsSlots.length ? (
          <div
            className={cnMixFlex({ flex: 'flex', align: 'center', gap: '2xs' })}
          >
            {controlsSlots.map((item, index) => {
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
            })}
          </div>
        ) : undefined}
        {contentSlots.length ? (
          <div className={cnMixFlex({ flex: 'flex', gap: '2xs' })}>
            {contentSlots.map((item, index) => {
              return <Fragment key={index}>{item}</Fragment>;
            })}
          </div>
        ) : undefined}
      </div>
    );
  },
);
