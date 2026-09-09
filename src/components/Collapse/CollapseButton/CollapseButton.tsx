import { AnimateIconSwitcherProvider } from '@consta/icons/AnimateIconSwitcherProvider';
import { IconComponent } from '@consta/icons/Icon';
import { Button } from '@consta/uikit/Button';
import React from 'react';

export const CollapseButton: React.FC<{
  icon?: IconComponent;
  active?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
}> = ({ icon, active, ...otherProps }) => (
  <AnimateIconSwitcherProvider active={active}>
    <Button
      {...otherProps}
      size="s"
      iconLeft={icon}
      view="ghost"
      form="round"
    />
  </AnimateIconSwitcherProvider>
);
