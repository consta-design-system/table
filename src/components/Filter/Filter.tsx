import './Filter.css';

import { IconSearchStroked } from '@consta/icons/IconSearchStroked';
import {
  useSendToAtom,
  withCtx,
} from '@consta/uikit/__internal__/src/utils/state';
import { isNotNil } from '@consta/uikit/__internal__/src/utils/type-guards';
import { Checkbox } from '@consta/uikit/Checkbox';
import { ListItem } from '@consta/uikit/ListCanary';
import { cnMixFlex } from '@consta/uikit/MixFlex';
import { cnMixSpace } from '@consta/uikit/MixSpace';
import { TextFieldTypeText } from '@consta/uikit/TextFieldCanary';
import { useAction } from '@reatom/npm-react';
import React, { forwardRef } from 'react';

import { cn } from '##/utils/bem';

import { withDefault } from './defaultProps';
import { FilterList } from './FilterList';
import {
  FilterComponent,
  FilterGroupDefault,
  FilterItemDefault,
  FilterPropRenderItem,
  FilterProps,
} from './types';
import { useFilter } from './useFilter';

const cnFilter = cn('Filter');

const renderSlot = (slot: React.ReactNode) => {
  if (Array.isArray(slot)) {
    return slot.filter(isNotNil).map((item, index) => (
      <div className={cnFilter('Slot')} key={index}>
        {item}
      </div>
    ));
  }
  return renderSlot([slot]);
};

const FilterRender = (p: FilterProps, ref: React.Ref<HTMLDivElement>) => {
  const props = withDefault(p);
  const propsAtom = useSendToAtom(props);

  const {
    form,

    disabled,
    value,
    renderValue,
    isLoading,
    dropdownRef: dropdownRefProp,

    renderItem,
    getGroupLabel,
    labelForCreate,
    labelForEmptyItems,
    virtualScroll,
    onScrollToBottom,
    style,
    className,
    placeholder,

    iconClear,
    input,
    inputValue,
    inputDefaultValue,
    inputRef: inputRefProp,

    // исключаем из otherProps
    getGroupKey,
    getItemDisabled,
    getItemGroupKey,
    getItemKey,
    getItemLabel,
    items,
    onChange: onChangeProp,
    dropdownClassName,
    onFocus,
    onBlur,
    onCreate: onCreateProp,
    onInput,
    multiple,
    groups,
    onDropdownOpen,
    ignoreOutsideClicksRefs,
    clearButton,
    selectAll,
    selectAllLabel,
    autoFocus,
    footer,
    ...otherProps
  } = props;

  const {
    getOptionActions,
    openAtom,
    visibleItemsAtom,
    focusAtom,
    handleInputFocus,
    handleInputBlur,
    handleToggleDropdown,
    inputRef,
    handleInputClick,
    handleInputChange,
    clearValue,
    optionsRefs,
    controlRef,
    dropdownRef,
    clearButtonAtom,
    highlightedIndexAtom,
    getItemKeyAtom,
    valueAtom,
    onChangeAll,
    highlightIndex,
    onCreate,
    onChange,
    inputValueAtom,
    getHandleRemoveValue,
    hasItemsAtom,
    groupsCounterAtom,
    dropdownZIndexAtom,
  } = useFilter<FilterItemDefault, FilterGroupDefault, false>({
    propsAtom,
  });

  const renderItemDefault: FilterPropRenderItem<FilterItemDefault> = useAction(
    (ctx, { item, active, hovered, onClick, onMouseEnter, ref }) => {
      return (
        <ListItem
          {...otherProps}
          ref={ref}
          // className={cnSelectItem(null, [className])}
          aria-selected={active}
          //   aria-disabled={disabled}
          role="option"
          label="sss"
          //   size={size}
          //   active={hovered}
          //   checked={!multiple && active}
          //   disabled={disabled}
          //   onClick={onClick}
          leftSide={
            <Checkbox
              checked
              //   disabled={disabled}
              size="s"
            />
          }
        >
          sss
        </ListItem>
      );
    },
    [],
  );

  return (
    <div {...otherProps} ref={ref} className={cnFilter(null, [className])}>
      <div className={cnFilter('Input', [cnMixSpace({ pV: '2xs', pH: 's' })])}>
        <TextFieldTypeText
          leftSide={IconSearchStroked}
          clearButton
          size="s"
          onChange={handleInputChange}
          view="clear"
          placeholder={placeholder}
          autoFocus={autoFocus}
        />
      </div>
      <FilterList
        renderItem={renderItem || renderItemDefault}
        items={items}
        value={value}
      />
      {footer && (
        <div
          className={cnFilter('Footer', [
            Array.isArray(footer)
              ? cnMixFlex({ flex: 'flex', justify: 'flex-end', gap: 'xs' })
              : undefined,
            cnMixSpace({ pV: 'xs', pH: 's' }),
          ])}
        >
          {renderSlot(footer)}
        </div>
      )}
    </div>
  );
};

export const Filter = withCtx(forwardRef(FilterRender)) as FilterComponent;
