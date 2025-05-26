import './Pagination.css';

import { IconArrowLeft } from '@consta/icons/IconArrowLeft';
import { IconArrowRight } from '@consta/icons/IconArrowRight';
import { withCtx } from '@consta/uikit/__internal__/src/utils/state/withCtx';
import { Button } from '@consta/uikit/Button';
import { cnMixFlex } from '@consta/uikit/MixFlex';
import { Select } from '@consta/uikit/SelectCanary';
import { Text } from '@consta/uikit/Text';
import { useMutableRef } from '@consta/uikit/useMutableRef';
import { useAction, useAtom, useUpdate } from '@reatom/npm-react';
import React, { forwardRef } from 'react';

import { cn } from '##/utils/bem';
import { isFunction, isNumber } from '##/utils/type-guards';

export type PaginationProps = JSX.IntrinsicElements['div'] & {
  label?: string;
  children?: never;
  length?: number;
  lengths?: number[];
  totalLength?: number;
  offset?: number;
  offsetLabel?:
    | string
    | ((offset: number, length: number, total: number) => string);
  onChange?: (value: number, props: { e: React.SyntheticEvent }) => void;
  onLengthChange?: (value: number, props: { e: React.SyntheticEvent }) => void;
  nextPageLabel?: string;
  prevPageLabel?: string;
};

const cnPagination = cn('Pagination');

const getItem = (item: number) => item.toString();

const defaultOffsetLabel = (offset: number, length: number, total: number) => {
  const from = offset + 1;
  const to = offset + length;
  return `${from}-${to > total ? total : to} из ${total}`;
};

export const Pagination = withCtx(
  forwardRef<HTMLDivElement, PaginationProps>((props, ref) => {
    const {
      label = 'Строк на странице',
      length = 10,
      lengths = [10, 25, 50, 100, 1000],
      totalLength = 300,
      offset = 0,
      offsetLabel = defaultOffsetLabel,
      className,
      nextPageLabel = 'Следующая страница',
      prevPageLabel = 'Предыдущая страница',
      onLengthChange,
      ...otherProps
    } = props;

    const [lengthValue, setLengthValue, lengthValueAtom] = useAtom(length);
    const [offsetValue, setOffsetValue, offsetValueAtom] = useAtom(offset);

    const refs = useMutableRef([onLengthChange]);

    const onSelectChange = useAction(
      (ctx, value: number | null, props: { e: React.SyntheticEvent }) => {
        const onLengthChange = refs.current[0];
        if (isNumber(value)) {
          lengthValueAtom(ctx, value);
          onLengthChange && isNumber(value) && onLengthChange(value, props);
        }
      },
    );

    const nextPageFactory = useAction((ctx, e: React.SyntheticEvent) => {
      const newValue = ctx.get(offsetValueAtom) + ctx.get(lengthValueAtom);
      offsetValueAtom(ctx, newValue < 0 ? 0 : newValue);
    });

    const prevPageFactory = useAction((ctx, e: React.SyntheticEvent) => {
      const newValue = ctx.get(offsetValueAtom) - ctx.get(lengthValueAtom);
      offsetValueAtom(ctx, newValue < 0 ? 0 : newValue);
    });

    useUpdate(lengthValueAtom, [length]);
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
          {lengths && (
            <Select
              className={cnPagination('Select')}
              items={lengths}
              getItemLabel={getItem}
              getItemKey={getItem}
              onChange={onSelectChange}
              value={lengthValue}
              size="s"
            />
          )}
        </div>
        <div className={cnMixFlex({ align: 'center', gap: 's' })}>
          {totalLength && isNumber(offset) && (
            <Text size="s" className={cnPagination('OffsetLabel')}>
              {isFunction(offsetLabel)
                ? offsetLabel(offsetValue, lengthValue, totalLength)
                : offsetLabel}
            </Text>
          )}

          <Button
            iconLeft={IconArrowLeft}
            onlyIcon
            title={nextPageLabel}
            view="clear"
            size="s"
            disabled={offsetValue <= 0}
            onClick={prevPageFactory}
          />
          <Button
            iconLeft={IconArrowRight}
            onlyIcon
            title={prevPageLabel}
            view="clear"
            size="s"
            onClick={nextPageFactory}
            disabled={offsetValue >= totalLength - lengthValue}
          />
        </div>
      </div>
    );
  }),
);
