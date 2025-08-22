import {
  objectWithDefault,
  WithDefaultReturn,
} from '@consta/uikit/__internal__/src/utils/object';

import { FilterGroupDefault, FilterItemDefault, FilterPropsInit } from '.';

// import { objectWithDefault, WithDefaultReturn } from '##/utils/object';

// import { FilterGroupDefault, FilterItemDefault, FilterPropsInit } from '.';

export const defaultLabelForEmptyItems = 'Список пуст';
export const defaultSelectAllLabel = 'Выбрать все';

const getItemKey = (item: FilterItemDefault) => item.id;
const getGroupKey = (group: FilterGroupDefault) => group.id;
const getGroupLabel = (group: FilterGroupDefault) => group.label;
const getItemDisabled = (item: FilterItemDefault) => item.disabled;
const getItemGroupKey = (item: FilterItemDefault) => item.groupId;
const getItemLabel = (item: FilterItemDefault) => item.label;

const defaultProps = {
  form: 'default',
  getItemKey,
  getGroupKey,
  getGroupLabel,
  getItemDisabled,
  getItemGroupKey,
  getItemLabel,
  labelForEmptyItems: defaultLabelForEmptyItems,
  selectAllLabel: defaultSelectAllLabel,
} as const;

export const withDefault = <
  ITEM = FilterItemDefault,
  GROUP = FilterGroupDefault,
  MULTIPLE extends boolean = false,
>(
  props: FilterPropsInit<ITEM, GROUP, MULTIPLE>,
): PropsWithDefault<ITEM, GROUP, MULTIPLE> =>
  objectWithDefault(defaultProps as any, props);

export type PropsWithDefaultMultiple = WithDefaultReturn<
  FilterPropsInit<FilterItemDefault, FilterGroupDefault, true>,
  keyof typeof defaultProps
>;

export type PropsWithDefaultSingle = WithDefaultReturn<
  FilterPropsInit<FilterItemDefault, FilterGroupDefault, false>,
  keyof typeof defaultProps
>;

export type PropsWithDefault<
  ITEM = FilterItemDefault,
  GROUP = FilterGroupDefault,
  MULTIPLE extends boolean = false,
> = WithDefaultReturn<
  FilterPropsInit<ITEM, GROUP, MULTIPLE>,
  keyof typeof defaultProps
>;
