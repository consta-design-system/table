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

export const Toolbar = forwardRef<HTMLDivElement, ToolbarProps>(
  ({ leftSide, rightSide, className, form = 'default', ...otherProps }) => {
    return (
      <div
        {...otherProps}
        className={cnToolbar({ form }, [
          cnMixFlex({ justify: 'space-between', gap: 's' }),
          className,
        ])}
      >
        {leftSide && (
          <div className={cnMixFlex({ gap: 's' })}>{renderSlot(leftSide)}</div>
        )}
        {rightSide && (
          <div className={cnMixFlex({ gap: 's' })}>{renderSlot(rightSide)}</div>
        )}
      </div>
    );
  },
);
