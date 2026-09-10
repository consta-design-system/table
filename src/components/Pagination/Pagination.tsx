import './Pagination.css';

import { IconArrowLeft } from '@consta/icons/IconArrowLeft';
import { IconArrowRight } from '@consta/icons/IconArrowRight';
import {
  computedSet,
  factoryComponent,
} from '@consta/uikit/__internal__/src/utils/state';
import { PropsWithHTMLAttributesAndRef } from '@consta/uikit/__internal__/src/utils/types/PropsWithHTMLAttributes';
import { Button } from '@consta/uikit/Button';
import { cnMixFlex } from '@consta/uikit/MixFlex';
import { Select } from '@consta/uikit/SelectCanary';
import { Text } from '@consta/uikit/Text';
import { action } from '@reatom/core';
import React from 'react';

import { cn } from '##/utils/bem';
import { isFunction, isNumber } from '##/utils/type-guards';

export type PaginationProps = PropsWithHTMLAttributesAndRef<
  {
    label?: string;
    children?: never;
    step?: number;
    steps?: number[];
    total?: number;
    offset?: number;
    offsetLabel?:
      | string
      | ((offset: number, step: number, total: number | undefined) => string);
    onChange?: (value: number, props: { e: React.SyntheticEvent }) => void;
    onStepChange?: (value: number, props: { e: React.SyntheticEvent }) => void;
    buttonNextRef?: React.Ref<HTMLButtonElement>;
    buttonPrevRef?: React.Ref<HTMLButtonElement>;
  },
  HTMLDivElement
>;

const cnPagination = cn('Pagination');

const getItem = (item: number) => item.toString();

const defaultOffsetLabel = (
  offset: number,
  step: number,
  total: number | undefined,
) => {
  const from = offset + 1;
  const to = offset + step;

  if (isNumber(total)) {
    return `${from}-${to > total ? total : to} из ${total}`;
  }
  return `${from}-${to}`;
};

const guardOffset = (value: number, total: number | undefined) => {
  if (isNumber(total)) {
    return Math.max(Math.min(value, total), 0);
  }
  return Math.max(value, 0);
};

export const Pagination = factoryComponent<HTMLDivElement, PaginationProps>(
  (_, propsAtom) => {
    const stepValueAtom = computedSet(() => propsAtom().step || 10);
    const offsetValueAtom = computedSet(() => propsAtom().offset || 0);

    const onSelectChange = action(
      (value: number | null, props: { e: React.SyntheticEvent }) => {
        if (isNumber(value)) {
          stepValueAtom.set(value);
          propsAtom().onStepChange?.(value, props);
        }
      },
    );

    const nextPageFactory = action((e: React.SyntheticEvent) => {
      const newValue = guardOffset(
        offsetValueAtom() + stepValueAtom(),
        propsAtom().total,
      );
      offsetValueAtom.set(newValue);
      propsAtom().onChange?.(newValue, { e });
    });

    const prevPageFactory = action((e: React.SyntheticEvent) => {
      const newValue = guardOffset(
        offsetValueAtom() - stepValueAtom(),
        propsAtom().total,
      );
      offsetValueAtom.set(newValue);
      propsAtom().onChange?.(newValue, { e });
    });

    return (props) => {
      const stepValue = stepValueAtom();
      const offsetValue = offsetValueAtom();

      const {
        label = 'Строк на странице',
        steps = [10, 25, 50, 100],
        total,
        offsetLabel = defaultOffsetLabel,
        className,
        buttonPrevRef,
        buttonNextRef,
        onStepChange,
        onChange,
        ref,
        ...otherProps
      } = props;

      return (
        <div
          ref={ref}
          {...otherProps}
          className={cnPagination(null, [
            cnMixFlex({ align: 'center', gap: 'xl' }),
            className,
          ])}
        >
          <div className={cnMixFlex({ align: 'center', gap: 's' })}>
            {label && (
              <Text size="s" view="secondary">
                {label}
              </Text>
            )}
            {steps && (
              <Select
                className={cnPagination('Select')}
                items={steps}
                getItemLabel={getItem}
                getItemKey={getItem}
                onChange={onSelectChange}
                value={stepValue}
                size="s"
              />
            )}
          </div>
          <div className={cnMixFlex({ align: 'center', gap: 's' })}>
            <Text size="s" className={cnPagination('OffsetLabel')}>
              {isFunction(offsetLabel)
                ? offsetLabel(offsetValue, stepValue, total)
                : offsetLabel}
            </Text>
            <Button
              ref={buttonPrevRef}
              iconLeft={IconArrowLeft}
              onlyIcon
              view="clear"
              size="s"
              disabled={offsetValue <= 0}
              onClick={prevPageFactory}
            />
            <Button
              ref={buttonNextRef}
              iconLeft={IconArrowRight}
              onlyIcon
              view="clear"
              size="s"
              onClick={nextPageFactory}
              disabled={total ? offsetValue >= total - stepValue : undefined}
            />
          </div>
        </div>
      );
    };
  },
);
