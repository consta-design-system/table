import './TableResizers.css';

import {
  factoryComponent,
  rangeAtom,
} from '@consta/uikit/__internal__/src/utils/state';
import { PropsWithHTMLAttributesAndRef } from '@consta/uikit/__internal__/src/utils/types/PropsWithHTMLAttributes';
import { action, Atom, AtomLike, Computed, computed } from '@reatom/core';
import React, { memo } from 'react';

import { cn } from '##/utils/bem';

import { TableColumn } from '../types';
import { visibleColumnsEffect } from './visibleColumnsEffect';

type TableResizersProps<T> = {
  lowHeadersAtom: Computed<TableColumn<T>[]>;
  resizersElementsAtom: AtomLike<Atom<HTMLDivElement | null>[]>;
  handlersAtom: AtomLike<
    {
      onMouseDown: () => void;
      onTouchStart: () => void;
    }[]
  >;
  resizableAtom: AtomLike<'inside' | 'outside' | undefined>;
  activeIndexAtom: AtomLike<number | null>;
  intersectingColumnsAtom: Atom<boolean[]>;
  bodyElementAtom: AtomLike<HTMLDivElement | null>;
  stickyHeaderAtom: AtomLike<boolean>;
};

export type TableResizersComponent = <T>(
  props: TableResizersProps<T>,
) => React.ReactNode | null;

const cnTableResizers = cn('TableResizers');

type TableResizerProps<T> = PropsWithHTMLAttributesAndRef<
  TableColumn<T> & {
    resizableAtom: AtomLike<'inside' | 'outside' | undefined>;
    index: number;
    lowHeadersLength: number;
    handlersAtom: AtomLike<
      {
        onMouseDown: () => void;
        onTouchStart: () => void;
      }[]
    >;
    activeIndexAtom: AtomLike<number | null>;
    virtualScrollHelperRef: React.Ref<HTMLDivElement>;
  },
  HTMLDivElement
>;

export type TableResizerComponent = <T>(
  props: TableResizerProps<T>,
) => React.ReactNode | null;

const TableResizer: TableResizerComponent = factoryComponent(
  ({ activeIndexAtom, handlersAtom }, propsAtom) => {
    const activeAtom = computed(() => propsAtom().index === activeIndexAtom());
    const onMouseDown = action(() =>
      handlersAtom()[propsAtom().index].onMouseDown(),
    );
    const onTouchStart = action(() =>
      handlersAtom()[propsAtom().index].onTouchStart(),
    );

    return ({
      resizableAtom,
      maxWidth,
      minWidth,
      isSeparator,
      pinned,
      index,
      lowHeadersLength,
      virtualScrollHelperRef,

      ref,
    }) => {
      const resizable = resizableAtom();
      const active = activeAtom();

      return (
        <div
          className={cnTableResizers('Cell')}
          ref={ref}
          style={{
            ['--table-resizer-top-offset' as string]: `var(--table-resizer-top-offset-${index})`,
          }}
        >
          <div
            ref={virtualScrollHelperRef}
            className={cnTableResizers('VirtualScrollHelper')}
          />
          {resizable &&
            (maxWidth === undefined || maxWidth !== minWidth) &&
            !isSeparator &&
            !pinned &&
            !(resizable === 'inside' && lowHeadersLength === index + 1) && (
              <div
                onMouseDown={onMouseDown}
                onTouchStart={onTouchStart}
                className={cnTableResizers('Resizer', {
                  active,
                })}
                aria-hidden
              />
            )}
        </div>
      );
    };
  },
);

export const TableResizers: TableResizersComponent = memo(
  factoryComponent(
    ({ bodyElementAtom, intersectingColumnsAtom, lowHeadersAtom }) => {
      const virtualScrollHelperElementsAtom = rangeAtom<HTMLDivElement | null>(
        computed(() => lowHeadersAtom().length),
        null,
      );

      visibleColumnsEffect(
        virtualScrollHelperElementsAtom,
        intersectingColumnsAtom,
        bodyElementAtom,
      );

      return ({
        handlersAtom,
        resizableAtom,
        activeIndexAtom,
        lowHeadersAtom,
        resizersElementsAtom,
        stickyHeaderAtom,
      }) => {
        const lowHeaders = lowHeadersAtom();
        const resizersElements = resizersElementsAtom();
        const virtualScrollHelperElements = virtualScrollHelperElementsAtom();
        const sticky = stickyHeaderAtom();

        return (
          <div className={cnTableResizers({ sticky })}>
            {lowHeaders.map(
              ({ maxWidth, minWidth, pinned, isSeparator }, index) => (
                <TableResizer
                  resizableAtom={resizableAtom}
                  key={index}
                  ref={resizersElements[index].set}
                  virtualScrollHelperRef={
                    virtualScrollHelperElements[index].set
                  }
                  maxWidth={maxWidth}
                  minWidth={minWidth}
                  pinned={pinned}
                  isSeparator={isSeparator}
                  index={index}
                  lowHeadersLength={lowHeaders.length}
                  handlersAtom={handlersAtom}
                  activeIndexAtom={activeIndexAtom}
                />
              ),
            )}
          </div>
        );
      };
    },
  ),
);
