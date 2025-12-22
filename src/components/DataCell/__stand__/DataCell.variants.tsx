import { AnimateIconSwitcherProvider } from '@consta/icons/AnimateIconSwitcherProvider';
import { IconArrowRight } from '@consta/icons/IconArrowRight';
import { IconPhone } from '@consta/icons/IconPhone';
import { withAnimateSwitcherHOC } from '@consta/icons/withAnimateSwitcherHOC';
import { useBoolean, useNumber, useSelect, useText } from '@consta/stand';
import { Badge } from '@consta/uikit/Badge';
import { Button } from '@consta/uikit/Button';
import { Checkbox } from '@consta/uikit/Checkbox';
import { useFlag } from '@consta/uikit/useFlag';
import React from 'react';

import { DataCell } from '..';

const IconArrow = withAnimateSwitcherHOC({
  startIcon: IconArrowRight,
  startDirection: 0,
  endDirection: 90,
});

const Variants = () => {
  const [checked, setChecked] = useFlag();
  const [open, setOpen] = useFlag();

  const text = useText('text', 'Значение ячейки');
  const size = useSelect('size', ['m', 's'], 'm');
  const lineClamp = useNumber('lineClamp', 0);
  const view = useSelect(
    'view',
    ['primary', 'alert', 'success', 'warning'],
    'primary',
  );
  const widthIcon = useBoolean('widthIcon');
  const control = useSelect(
    'controls',
    ['without control', 'with one control', 'with multiple controls'],
    'without control',
  );
  const multipleChildren = useBoolean('multipleChildren');
  const level = useNumber('level', 0);
  const indicator = useSelect('indicator', ['alert', 'warning']);
  const buttonSizeMap = { m: 's', s: 'xs' } as const;
  const checkboxSizeMap = { m: 'l', s: 's' } as const;

  const controlMap = {
    'without control': undefined,
    'with one control': (
      <Checkbox checked={checked} onChange={setChecked.toggle} />
    ),
    'with multiple controls': [
      <Button
        view="clear"
        iconLeft={IconArrow}
        onlyIcon
        onClick={setOpen.toggle}
        size={buttonSizeMap[size || 'm']}
      />,
      <Checkbox
        size={checkboxSizeMap[size || 'm']}
        checked={checked}
        onChange={setChecked.toggle}
      />,
    ],
  } as const;

  const children = multipleChildren
    ? [
        text,
        <Badge
          style={{ display: 'block' }}
          size="s"
          status="normal"
          label="Нормально"
        />,
      ]
    : text;

  return (
    <AnimateIconSwitcherProvider active={open}>
      <DataCell
        size={size}
        view={view}
        level={level}
        icon={widthIcon ? IconPhone : undefined}
        control={controlMap[control || 'without control']}
        indicator={indicator}
        lineClamp={lineClamp}
      >
        {children}
      </DataCell>
    </AnimateIconSwitcherProvider>
  );
};

export default Variants;
