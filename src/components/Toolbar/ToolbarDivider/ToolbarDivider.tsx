import './ToolbarDivider.css';

import React from 'react';

import { cn } from '##/utils/bem';

const cnToolbarDivider = cn('ToolbarDivider');

type ToolbarDividerProps = JSX.IntrinsicElements['div'] & {
  size?: 'xs' | 's' | 'm' | 'l';
};

export const ToolbarDivider = ({
  className,
  size = 's',
  style,
  ...otherProps
}: ToolbarDividerProps) => {
  return (
    <div
      {...otherProps}
      style={{
        ...style,
        ['--toolbar-divider-height' as string]: `var(--control-height-${size})`,
      }}
      className={cnToolbarDivider(null, className)}
    />
  );
};
