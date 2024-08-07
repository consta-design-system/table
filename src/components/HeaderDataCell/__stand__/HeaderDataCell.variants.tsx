import { AnimateIconSwitcherProvider } from '@consta/icons/AnimateIconSwitcherProvider';
import { IconArrowLeft } from '@consta/icons/IconArrowLeft';
import { IconArrowRight } from '@consta/icons/IconArrowRight';
import { IconFunnel } from '@consta/icons/IconFunnel';
import { IconKebab } from '@consta/icons/IconKebab';
import { IconUnsort } from '@consta/icons/IconUnsort';
import { withAnimateSwitcherHOC } from '@consta/icons/withAnimateSwitcherHOC';
import { useBoolean, useSelect, useText } from '@consta/stand';
import { Button } from '@consta/uikit/Button';
import { Checkbox } from '@consta/uikit/Checkbox';
import { useFlag } from '@consta/uikit/useFlag';
import React from 'react';

import { HeaderDataCell } from '..';

const IconArrow = withAnimateSwitcherHOC({
  startIcon: IconArrowLeft,
  endIcon: IconArrowRight,
});

const Variants = () => {
  const [open, setOpen] = useFlag();

  const text = useText('text', 'Заголовок колонки');
  const size = useSelect('size', ['m', 's'], 'm');

  const controlRight = useSelect(
    'controlRight',
    ['without control', 'with one control', 'with multiple controls'],
    'without control',
  );

  const controlLeft = useSelect(
    'controlLeft',
    ['without control', 'with one control'],
    'without control',
  );
  const multipleChildren = useBoolean('multipleChildren');

  const buttonSizeMap = { m: 's', s: 'xs' } as const;
  // const checkboxSizeMap = { m: 'm', s: 's' } as const;

  const controlLeftMap = {
    'without control': undefined,
    'with one control': <Checkbox checked={false} size={size} />,
  } as const;

  const controlRightMap = {
    'without control': undefined,
    'with one control': (
      <Button
        view="clear"
        iconLeft={IconUnsort}
        onlyIcon
        size={buttonSizeMap[size || 'm']}
      />
    ),
    'with multiple controls': [
      <Button
        view="clear"
        iconLeft={IconUnsort}
        onlyIcon
        size={buttonSizeMap[size || 'm']}
      />,
      <Button
        view="clear"
        iconLeft={IconFunnel}
        onlyIcon
        size={buttonSizeMap[size || 'm']}
      />,
      <Button
        view="clear"
        iconLeft={IconKebab}
        onlyIcon
        size={buttonSizeMap[size || 'm']}
      />,
    ],
  } as const;

  const children = multipleChildren
    ? [
        text,
        <Button
          view="clear"
          iconLeft={IconArrow}
          onlyIcon
          onClick={setOpen.toggle}
          size={buttonSizeMap[size || 'm']}
        />,
      ]
    : text;

  return (
    <AnimateIconSwitcherProvider active={open}>
      <HeaderDataCell
        size={size}
        controlRight={controlRightMap[controlRight || 'without control']}
        controlLeft={controlLeftMap[controlLeft || 'without control']}
      >
        {children}
      </HeaderDataCell>
    </AnimateIconSwitcherProvider>
  );
};

export default Variants;
