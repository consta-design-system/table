import './TableResizers.css';

import { useSendToAtom } from '@consta/uikit/__internal__/src/utils/state/useSendToAtom';
import { PropsWithHTMLAttributesAndRef } from '@consta/uikit/__internal__/src/utils/types/PropsWithHTMLAttributes';
import { useRefs } from '@consta/uikit/useRefs';
import { AtomMut } from '@reatom/core';
import { useAtom } from '@reatom/npm-react';
import React, { forwardRef, memo } from 'react';

import { cn } from '##/utils/bem';

import { TableColumn } from '../types';
import { useVisibleColumns } from './useVisibleColumns';

type TableResizersProps<T> = {
  lowHeadersAtom: AtomMut<TableColumn<T>[]>;
  resizersRefsAtom: AtomMut<React.RefObject<HTMLDivElement>[]>;
  handlersAtom: AtomMut<
    {
      onMouseDown: () => void;
      onTouchStart: () => void;
    }[]
  >;
  resizableAtom: AtomMut<'inside' | 'outside' | undefined>;
  activeIndexAtom: AtomMut<number | null>;
  intersectingColumnsAtom: AtomMut<boolean[]>;
  bodyElAtom: AtomMut<HTMLDivElement | null>;
};

export type TableResizersComponent = <T>(
  props: TableResizersProps<T>,
) => React.ReactNode | null;

const cnTableResizers = cn('TableResizers');

type TableResizerProps<T> = PropsWithHTMLAttributesAndRef<
  TableColumn<T> & {
    resizableAtom: AtomMut<'inside' | 'outside' | undefined>;
    index: number;
    lowHeadersLength: number;
    handlersAtom: AtomMut<
      {
        onMouseDown: () => void;
        onTouchStart: () => void;
      }[]
    >;
    activeIndexAtom: AtomMut<number | null>;
    virtualScrollHelperRef: React.RefObject<HTMLDivElement>;
  },
  HTMLDivElement
>;

export type TableResizerComponent = <T>(
  props: TableResizerProps<T>,
) => React.ReactNode | null;

const TableResizer: TableResizerComponent = forwardRef(
  (
    {
      resizableAtom,
      maxWidth,
      minWidth,
      isSeparator,
      pinned,
      index,
      lowHeadersLength,
      handlersAtom,
      activeIndexAtom,
      virtualScrollHelperRef,
    },
    ref,
  ) => {
    const [resizable] = useAtom(resizableAtom);
    const [handlers] = useAtom(handlersAtom);
    const indexAtom = useSendToAtom(index);
    const [active] = useAtom(
      (ctx) => ctx.spy(indexAtom) === ctx.spy(activeIndexAtom),
    );

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
              {...handlers[index]}
              className={cnTableResizers('Resizer', {
                active,
              })}
              aria-hidden
            />
          )}
      </div>
    );
  },
);

export const TableResizers: TableResizersComponent = memo((props) => {
  const {
    lowHeadersAtom,
    resizersRefsAtom,
    handlersAtom,
    resizableAtom,
    activeIndexAtom,
    intersectingColumnsAtom,
    bodyElAtom,
  } = props;
  const [resizersRefs] = useAtom(resizersRefsAtom);
  const [lowHeaders] = useAtom(lowHeadersAtom);
  const virtualScrollHelperRefs = useRefs<HTMLDivElement>(lowHeaders.length);

  useVisibleColumns(
    virtualScrollHelperRefs,
    intersectingColumnsAtom,
    bodyElAtom,
  );

  return (
    <div className={cnTableResizers()}>
      {lowHeaders.map(({ maxWidth, minWidth, pinned, isSeparator }, index) => (
        <TableResizer
          resizableAtom={resizableAtom}
          key={index}
          ref={resizersRefs[index]}
          virtualScrollHelperRef={virtualScrollHelperRefs[index]}
          maxWidth={maxWidth}
          minWidth={minWidth}
          pinned={pinned}
          isSeparator={isSeparator}
          index={index}
          lowHeadersLength={lowHeaders.length}
          handlersAtom={handlersAtom}
          activeIndexAtom={activeIndexAtom}
        />
      ))}
    </div>
  );
});
