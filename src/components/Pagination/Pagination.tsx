import './Pagination.css';

import { IconArrowLeft } from '@consta/icons/IconArrowLeft';
import { IconArrowRight } from '@consta/icons/IconArrowRight';
import { withCtx } from '@consta/uikit/__internal__/src/utils/state/withCtx';
import { PropsWithHTMLAttributesAndRef } from '@consta/uikit/__internal__/src/utils/types/PropsWithHTMLAttributes';
import { Button } from '@consta/uikit/Button';
import { cnMixFlex } from '@consta/uikit/MixFlex';
import { Select } from '@consta/uikit/SelectCanary';
import { Text } from '@consta/uikit/Text';
import { useMutableRef } from '@consta/uikit/useMutableRef';
import { useAction, useAtom, useUpdate } from '@reatom/npm-react';
import React, { forwardRef } from 'react';

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

export const Pagination = withCtx(
  forwardRef<HTMLDivElement, PaginationProps>((props, ref) => {
    const {
      label = 'Строк на странице',
      step = 10,
      steps = [10, 25, 50, 100],
      total,
      offset = 0,
      offsetLabel = defaultOffsetLabel,
      className,
      buttonPrevRef,
      buttonNextRef,
      onStepChange,
      onChange,
      ...otherProps
    } = props;

    const refs = useMutableRef([onStepChange, total, onChange] as const);

    const [stepValue, setStepValue, stepValueAtom] = useAtom(step);
    const [offsetValue, setOffsetValue, offsetValueAtom] = useAtom(
      guardOffset(offset, total),
    );

    const onSelectChange = useAction(
      (ctx, value: number | null, props: { e: React.SyntheticEvent }) => {
        if (isNumber(value)) {
          stepValueAtom(ctx, value);
          refs.current[0]?.(value, props);
        }
      },
    );

    const nextPageFactory = useAction((ctx, e: React.SyntheticEvent) => {
      const newValue = guardOffset(
        ctx.get(offsetValueAtom) + ctx.get(stepValueAtom),
        refs.current[1],
      );
      offsetValueAtom(ctx, newValue);
      refs.current[2]?.(newValue, { e });
    });

    const prevPageFactory = useAction((ctx, e: React.SyntheticEvent) => {
      const newValue = guardOffset(
        ctx.get(offsetValueAtom) - ctx.get(stepValueAtom),
        refs.current[1],
      );
      offsetValueAtom(ctx, newValue);
      refs.current[2]?.(newValue, { e });
    });

    useUpdate(stepValueAtom, [step]);
    useUpdate(offsetValueAtom, [offset]);

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
  }),
);
