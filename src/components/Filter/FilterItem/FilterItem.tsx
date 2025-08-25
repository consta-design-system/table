import './FilterItem.css';

import { PropsWithHTMLAttributesAndRef } from '@consta/uikit/__internal__/src/utils/types/PropsWithHTMLAttributes';
import { Checkbox, CheckboxPropSize } from '@consta/uikit/Checkbox';
import { FieldPropSize } from '@consta/uikit/FieldComponents';
import { ListItem } from '@consta/uikit/ListCanary';
import React, { forwardRef } from 'react';

import { cnCanary as cn } from '##/utils/bem';

export type SelectItemProps = PropsWithHTMLAttributesAndRef<
  {
    label: string;
    active: boolean;
    hovered: boolean;
    multiple?: boolean;
    size: FieldPropSize;
    indent: 'normal' | 'increased';
    disabled: boolean | undefined;
  },
  HTMLDivElement
>;

export const sizeCheckboxMap: Record<FieldPropSize, CheckboxPropSize> = {
  xs: 's',
  s: 's',
  m: 'm',
  l: 'l',
};

export const cnSelectItem = cn('SelectItem');

export const SelectItem: React.FC<SelectItemProps> = forwardRef(
  (props, ref) => {
    const {
      className,
      label,
      active,
      hovered,
      multiple,
      size,
      indent,
      disabled,
      onClick,
      ...otherProps
    } = props;

    console.log('SelectItem');

    return (
      <ListItem
        {...otherProps}
        ref={ref}
        className={cnSelectItem(null, [className])}
        aria-selected={active}
        aria-disabled={disabled}
        role="option"
        label={label}
        innerOffset={indent}
        size={size}
        active={hovered}
        checked={!multiple && active}
        disabled={disabled}
        onClick={onClick}
        leftSide={
          multiple && (
            <Checkbox
              checked={active}
              disabled={disabled}
              size={sizeCheckboxMap[size]}
            />
          )
        }
      >
        {label}
      </ListItem>
    );
  },
);
