import './Filter.css';

import {
  useSendToAtom,
  withCtx,
} from '@consta/uikit/__internal__/src/utils/state';
import { isNotNil } from '@consta/uikit/__internal__/src/utils/type-guards';
import { Checkbox } from '@consta/uikit/Checkbox';
import { FieldInput } from '@consta/uikit/FieldComponents';
import { ListItem } from '@consta/uikit/ListCanary';
import { cnMixFlex } from '@consta/uikit/MixFlex';
import { cnMixSpace } from '@consta/uikit/MixSpace';
import { TextFieldTypeText } from '@consta/uikit/TextFieldCanary';
import { useForkRef } from '@consta/uikit/useForkRef';
import { useAction } from '@reatom/npm-react';
import React, { forwardRef } from 'react';

import { cn } from '##/utils/bem';

import { withDefault } from './defaultProps';
import { FilterControlLayout } from './FilterControlLayout';
import { FilterList } from './FilterList';
import {
  FilterComponent,
  FilterGroupDefault,
  FilterItemDefault,
  FilterPropRenderItem,
  FilterProps,
  RenderItemProps,
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
    // renderValue,
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
    // dropdownClassName,
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
    (
      ctx,
      {
        item,
        active,
        hovered,
        onClick,
        onMouseEnter,
        ref,
      }: RenderItemProps<FilterItemDefault>,
    ) => {
      return (
        <ListItem
          {...otherProps}
          ref={ref}
          // className={cnSelectItem(null, [className])}
          aria-selected={active}
          aria-disabled={getItemDisabled(item) || disabled}
          role="option"
          label={getItemLabel(item)}
          //   size={size}
          active={hovered}
          checked={!multiple && active}
          disabled={disabled}
          onClick={onClick}
          leftSide={
            multiple && (
              <Checkbox
                checked={active}
                disabled={disabled}
                size="s"
                tabIndex={-1}
              />
            )
          }
        />
      );
    },
    [getItemLabel, getItemDisabled, multiple, disabled],
  );

  return (
    <div {...otherProps} ref={ref} className={cnFilter(null, [className])}>
      <div className={cnFilter('Input', [cnMixSpace({ pV: '2xs', pH: 's' })])}>
        <FilterControlLayout
          {...otherProps}
          style={style}
          form={form}
          disabled={disabled}
          separator
          onClear={clearValue}
          onDropdownButton={handleToggleDropdown}
          openAtom={openAtom}
          focusAtom={focusAtom}
          //   view={view}
          iconClear={iconClear}
          clearButtonAtom={clearButtonAtom}
          ref={useForkRef([ref, controlRef])}
        >
          <FieldInput
            //   className={cnSelectInput('Input', { readOnly })}
            //   readOnly={readOnly}
            //   {...props}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            ref={useForkRef([inputRef, inputRefProp])}
            onClick={handleInputClick}
            onChange={handleInputChange}
            value={inputValue}
            defaultValue={inputDefaultValue}
            disabled={disabled}
            placeholder={placeholder}
            // aria-label={ariaLabel}
            // ref={inputRef}
          />
        </FilterControlLayout>
      </div>
      <FilterList
        valueAtom={valueAtom}
        getItemKeyAtom={getItemKeyAtom}
        openAtom={openAtom}
        // size={size}
        controlRef={controlRef}
        getOptionActions={getOptionActions}
        // dropdownRef={useForkRef([dropdownRef, dropdownRefProp])}
        // form={dropdownForm}
        // className={dropdownClassName}
        renderItem={renderItem || renderItemDefault}
        getGroupLabel={getGroupLabel}
        visibleItemsAtom={visibleItemsAtom}
        labelForCreate={labelForCreate}
        isLoading={isLoading}
        labelForEmptyItems={labelForEmptyItems}
        itemsRefs={optionsRefs}
        virtualScroll={virtualScroll}
        onScrollToBottom={onScrollToBottom}
        highlightedIndexAtom={highlightedIndexAtom}
        highlightIndex={highlightIndex}
        onChangeAll={onChangeAll}
        onCreate={onCreate}
        onChange={onChange}
        inputValueAtom={inputValueAtom}
        hasItemsAtom={hasItemsAtom}
        groupsCounterAtom={groupsCounterAtom}
        dropdownZIndexAtom={dropdownZIndexAtom}
        selectAllLabel={selectAllLabel}
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
