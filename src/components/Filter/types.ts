import { IconComponent } from '@consta/icons/Icon';
import { PropsWithHTMLAttributesAndRef } from '@consta/uikit/__internal__/src/utils/types/PropsWithHTMLAttributes';
import React from 'react';

export type RenderItemProps<ITEM> = {
  item: ITEM;
  active: boolean;
  hovered: boolean;
  onClick: (e: React.MouseEvent) => void;
  onMouseEnter: (e: React.MouseEvent) => void;
  ref: React.Ref<HTMLDivElement>;
};

export type FilterItemDefault = {
  label: string;
  id: string | number;
  groupId?: string | number;
  disabled?: boolean;
};

export type FilterGroupDefault = {
  label: string;
  id: string | number;
};

export type FilterPropGetItemLabel<ITEM> = (item: ITEM) => string;
export type FilterPropGetItemKey<ITEM> = (item: ITEM) => string | number;
export type FilterPropGetItemGroupKey<ITEM> = (
  item: ITEM,
) => string | number | undefined;
export type FilterPropGetItemDisabled<ITEM> = (
  item: ITEM,
) => boolean | undefined;
export type FilterPropGetGroupKey<GROUP> = (group: GROUP) => string | number;
export type FilterPropGetGroupLabel<GROUP> = (group: GROUP) => string;

export type FilterPropOnChange<ITEM, MULTIPLE extends boolean> = (
  value: (MULTIPLE extends true ? ITEM[] : ITEM) | null,
  props: {
    e: React.SyntheticEvent;
  },
) => void;
export type FilterPropValue<ITEM, MULTIPLE extends boolean> =
  | (MULTIPLE extends true ? ITEM[] : ITEM)
  | null
  | undefined;

export type FilterPropRenderItem<ITEM> = (
  props: RenderItemProps<ITEM>,
) => React.ReactNode | null;

export type FilterPropRenderValue<ITEM, MULTIPLE> = MULTIPLE extends true
  ? (props: {
      value: ITEM[];
      getRemove: (
        item: ITEM,
      ) => (e: React.SyntheticEvent<Element, Event>) => void;
    }) => React.ReactNode | null
  : (props: { value: ITEM }) => React.ReactNode | null;

export type FilterPropOnCreate = (
  label: string,
  props: { e: React.SyntheticEvent },
) => void;

export type FilterAllItem = {
  groupKey: string | number;
  __optionSelectAll: true;
};

export type Group<ITEM, GROUP> = {
  items: ITEM[];
  key: string | number;
  group?: GROUP;
};

export type CountedGroup<ITEM, GROUP> = Omit<Group<ITEM, GROUP>, 'items'> & {
  items: Array<FilterAllItem | ITEM>;
};

export type FilterPropsInit<
  ITEM = FilterItemDefault,
  GROUP = FilterGroupDefault,
  MULTIPLE extends boolean = false,
> = PropsWithHTMLAttributesAndRef<
  {
    'items': ITEM[];
    'onChange': FilterPropOnChange<ITEM, MULTIPLE>;
    'disabled'?: boolean;
    'form'?: 'default' | 'brick' | 'round';
    'placeholder'?: string;
    'aria-Label'?: string;
    'isLoading'?: boolean;
    'dropdownClassName'?: string;
    'dropdownRef'?: React.Ref<HTMLDivElement>;
    'renderItem'?: FilterPropRenderItem<ITEM>;
    'renderValue'?: FilterPropRenderValue<ITEM, MULTIPLE>;
    'onFocus'?: React.FocusEventHandler<HTMLInputElement>;
    'onBlur'?: React.FocusEventHandler<HTMLInputElement>;
    'onCreate'?: FilterPropOnCreate;
    'inputRef'?: React.Ref<HTMLInputElement>;
    'input'?: boolean;
    'inputValue'?: string;
    'inputDefaultValue'?: string;
    'onInput'?: (value: string) => void;
    'labelForCreate'?:
      | ((label: string | undefined) => React.ReactNode)
      | React.ReactNode;
    'labelForEmptyItems'?: string;
    'multiple'?: MULTIPLE;
    'value'?: FilterPropValue<ITEM, MULTIPLE>;
    'groups'?: GROUP[];
    'getItemLabel'?: FilterPropGetItemLabel<ITEM>;
    'getItemKey'?: FilterPropGetItemKey<ITEM>;
    'getItemGroupKey'?: FilterPropGetItemGroupKey<ITEM>;
    'getItemDisabled'?: FilterPropGetItemDisabled<ITEM>;
    'getGroupLabel'?: FilterPropGetGroupLabel<GROUP>;
    'getGroupKey'?: FilterPropGetGroupKey<GROUP>;
    'virtualScroll'?: boolean;
    'onScrollToBottom'?: (length: number) => void;
    'onDropdownOpen'?: (isOpen: boolean) => void;
    'dropdownOpen'?: boolean;
    'ignoreOutsideClicksRefs'?: ReadonlyArray<React.RefObject<HTMLElement>>;
    'clearButton'?: boolean;
    'iconClear'?: IconComponent;
    'selectAll'?: MULTIPLE extends true ? boolean : never;
    'selectAllLabel'?: string;
    'footer': React.ReactNode;
  },
  HTMLDivElement
>;

export type FilterProps<
  ITEM = FilterItemDefault,
  GROUP = FilterGroupDefault,
  MULTIPLE extends boolean = false,
> = FilterPropsInit<ITEM, GROUP, MULTIPLE> &
  (ITEM extends { label: FilterItemDefault['label'] }
    ? {}
    : { getItemLabel: FilterPropGetItemLabel<ITEM> }) &
  (ITEM extends { id: FilterItemDefault['id'] }
    ? {}
    : { getItemKey: FilterPropGetItemKey<ITEM> }) &
  (GROUP extends { label: FilterGroupDefault['label'] }
    ? {}
    : { getGroupLabel: FilterPropGetGroupLabel<GROUP> }) &
  (GROUP extends { id: FilterGroupDefault['id'] }
    ? {}
    : { getGroupKey: FilterPropGetGroupKey<GROUP> });

export type FilterComponent = <
  ITEM = FilterItemDefault,
  GROUP = FilterGroupDefault,
  MULTIPLE extends boolean = false,
>(
  props: FilterProps<ITEM, GROUP, MULTIPLE>,
) => React.ReactNode | null;
