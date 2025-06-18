import './Toolbar.css';

import { isNotNil } from '@consta/uikit/__internal__/src/utils/type-guards';
import { cnMixFlex } from '@consta/uikit/MixFlex';
import { cnMixSpace, MixSpaceProps, Space } from '@consta/uikit/MixSpace';
import React, { forwardRef } from 'react';

import { cn } from '##/utils/bem';

const cnToolbar = cn('Toolbar');

export type ToolbarProps = JSX.IntrinsicElements['div'] & {
  leftSide?: React.ReactNode;
  rightSide?: React.ReactNode;
  form?: 'default' | 'brick' | 'brickDefault' | 'defaultBrick';
  children?: never;
  border?: 'top' | 'bottom' | 'all' | boolean;
  space?: MixSpaceProps;
  itemsGap?: Space | [Space, Space];
};

const renderSlot = (slot: React.ReactNode) => {
  if (Array.isArray(slot)) {
    return slot.filter(isNotNil).map((item, index) => (
      <div className={cnToolbar('Slot')} key={index}>
        {item}
      </div>
    ));
  }
  return renderSlot([slot]);
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

  if (border === true) {
    return 'all';
  }

  return border;
};

const getGap = (gap: Space | [Space, Space], index: number) => {
  if (Array.isArray(gap)) {
    return gap[index];
  }
  return gap;
};

export const Toolbar = forwardRef<HTMLDivElement, ToolbarProps>(
  (
    {
      leftSide,
      rightSide,
      className,
      form = 'default',
      border,
      space = { pH: 's', pV: 'xs' },
      itemsGap = 's',
      ...otherProps
    },
    ref,
  ) => {
    return (
      <div
        {...otherProps}
        ref={ref}
        className={cnToolbar({ form, border: guardBorder(border, form) }, [
          cnMixFlex({
            justify: rightSide && !leftSide ? 'flex-end' : 'space-between',
            gap: 'm',
          }),
          cnMixSpace(space),
          className,
        ])}
      >
        {leftSide && (
          <div className={cnMixFlex({ gap: getGap(itemsGap, 0) })}>
            {renderSlot(leftSide)}
          </div>
        )}
        {rightSide && (
          <div
            className={cnMixFlex({
              gap: getGap(itemsGap, 1),
              justify: 'flex-end',
            })}
          >
            {renderSlot(rightSide)}
          </div>
        )}
      </div>
    );
  },
);
