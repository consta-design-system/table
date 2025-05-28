import './Toolbar.css';

import { cnMixFlex } from '@consta/uikit/MixFlex';
import React, { forwardRef } from 'react';

import { cn } from '##/utils/bem';

const cnToolbar = cn('Toolbar');

export type ToolbarProps = JSX.IntrinsicElements['div'] & {
  leftSide?: React.ReactNode | React.ReactNode[];
  rightSide?: React.ReactNode | React.ReactNode[];
  form?: 'default' | 'brick' | 'brickDefault' | 'defaultBrick';
  children?: never;
  border?: 'top' | 'bottom' | 'all';
};

const renderSlot = (slot: React.ReactNode | React.ReactNode[]) => {
  if (Array.isArray(slot)) {
    return slot.map((item, index) => (
      <div className={cnToolbar('Slot')} key={index}>
        {item}
      </div>
    ));
  }
  return <div className={cnToolbar('Slots')}>{slot}</div>;
};

const guardBorder = (
  border: ToolbarProps['border'],
  form: ToolbarProps['form'],
) => {
  if (
    (border === 'top' && form === 'defaultBrick') ||
    (border === 'bottom' && form === 'brickDefault') ||
    (border === 'top' && form === 'default') ||
    (border === 'bottom' && form === 'default')
  ) {
    return undefined;
  }
  return border;
};

export const Toolbar = forwardRef<HTMLDivElement, ToolbarProps>(
  ({
    leftSide,
    rightSide,
    className,
    form = 'default',
    border,
    ...otherProps
  }) => {
    return (
      <div
        {...otherProps}
        className={cnToolbar({ form, border: guardBorder(border, form) }, [
          cnMixFlex({
            justify: rightSide && !leftSide ? 'flex-end' : 'space-between',
            gap: 's',
          }),
          className,
        ])}
      >
        {leftSide && (
          <div className={cnMixFlex({ gap: 's' })}>{renderSlot(leftSide)}</div>
        )}
        {rightSide && (
          <div className={cnMixFlex({ gap: 's', justify: 'flex-end' })}>
            {renderSlot(rightSide)}
          </div>
        )}
      </div>
    );
  },
);
