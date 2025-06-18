import { AnimateIconSwitcherProvider } from '@consta/icons/AnimateIconSwitcherProvider';
import { IconComponent } from '@consta/icons/Icon';
import { Button } from '@consta/uikit/Button';
import React from 'react';

export const CollapseButton: React.FC<{
  icon?: IconComponent;
  active?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}> = ({ icon, active, onClick }) => (
  <AnimateIconSwitcherProvider active={active}>
    <Button
      onClick={onClick}
      size="s"
      iconLeft={icon}
      view="ghost"
      form="round"
    />
  </AnimateIconSwitcherProvider>
);
