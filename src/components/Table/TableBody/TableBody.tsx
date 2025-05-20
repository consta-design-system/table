import './TableBody.css';

import { useCreateAtom } from '@consta/uikit/__internal__/src/utils/state/useCreateAtom';
import { usePropAtom } from '@consta/uikit/__internal__/src/utils/state/usePickAtom';
import { useSendToAtom } from '@consta/uikit/__internal__/src/utils/state/useSendToAtom';
import { cnMixScrollBar } from '@consta/uikit/MixScrollBar';
import { useForkRef } from '@consta/uikit/useForkRef';
import { getElementSize } from '@consta/uikit/useResizeObserved';
import { AtomMut } from '@reatom/core';
import { useAtom } from '@reatom/npm-react';
import React, { forwardRef, memo, useMemo, useRef } from 'react';

import { useResizeObservedAtom } from '##/hooks/useResizeObservedAtom';
import { cn } from '##/utils/bem';

import {
  columnDefaultMinWidth,
  separatorLargeWidth,
  separatorWidth,
} from '../helpers';
import { cnTableCell } from '../TableCell';
import { TableResizers } from '../TableResizers';
import { TableSeparatorTitles } from '../TableSeparatorTitles';
import { TableVirtualScrollSpaceTop } from '../TableVirtualScrollSpaceTop';
import { TableBodyComponent, TableBodyRootComponent } from '../types';
import {
  getGridTemplate,
  getStyleByArray,
  getStyleLeftOffsetsForStickyColumns,
  getStyleRightOffsetsForStickyColumns,
  printSize,
} from './helpers';
import { useResizableColumns } from './useResizableColumns';

export const cnTableBody = cn('TableBody');

const getRandomHash = () =>
  Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

const Style = ({
  atom,
  className,
}: {
  atom: AtomMut<string>;
  className: string;
}) => {
  return (
    <style>
      {`.${className} {`} {useAtom(atom)[0]} {`}`}
    </style>
  );
};

const Styles = memo(
  ({ atoms, className }: { atoms: AtomMut<string>[]; className: string }) => (
    <>
      {atoms.map((atom, index) => (
        <Style key={index} atom={atom} className={className} />
      ))}
    </>
  ),
  () => true,
);

const TableBodyRoot: TableBodyRootComponent = forwardRef(
  (
    {
      children,
      className,
      headerHeightAtom,
      spaceTopAtom,
      sizesAtom,
      topOffsetsAtom,
      stickyTopOffsetsAtom,
      headerZIndexAtom,
      resizingAtom,
      ...otherProps
    },
    ref,
  ) => {
    const [randomClass] = useAtom(
      cnTableBody({ instance: getRandomHash() }).split(' ')[1],
    );
    const bodyRef = useRef<HTMLDivElement>(null);
    const bodySizeAtom = useResizeObservedAtom(
      useMemo(() => [bodyRef], [bodyRef]),
      getElementSize,
    );

    const tableBodyHeightAtom = useCreateAtom(
      (ctx) => `--table-body-height: ${ctx.spy(bodySizeAtom)[0].height}px;`,
    );
    const tableBodyWidthAtom = useCreateAtom(
      (ctx) => `--table-body-width: ${ctx.spy(bodySizeAtom)[0].width}px;`,
    );
    const tableHeaderHeightAtom = useCreateAtom(
      (ctx) => `--table-header-height: ${ctx.spy(headerHeightAtom)}px;`,
    );
    const tableBodySpaceTopAtom = useCreateAtom(
      (ctx) => `--table-body-space-top: ${ctx.spy(spaceTopAtom)}px;`,
    );
    const sizesLength = useCreateAtom((ctx) => ctx.spy(sizesAtom).length);
    const tableGrigColumnsLengthAtom = useCreateAtom(
      (ctx) => `--table-grid-columns-length: ${ctx.spy(sizesLength)};`,
    );
    const tableGridTemplateColumnsAtom = useCreateAtom(
      (ctx) =>
        `--table-grid-template-columns: ${getGridTemplate(
          ctx.spy(sizesLength),
        )};`,
    );
    const tableColumnSizesAtom = useCreateAtom((ctx) =>
      getStyleByArray(ctx.spy(sizesAtom), '--table-column-size', printSize),
    );
    const tableColumnLeftOffsetsAtom = useCreateAtom((ctx) =>
      getStyleLeftOffsetsForStickyColumns(ctx.spy(sizesLength)),
    );
    const tableColumnRightOffsetsAtom = useCreateAtom((ctx) =>
      getStyleRightOffsetsForStickyColumns(ctx.spy(sizesLength)),
    );
    const tableResizerTopOffsetsAtom = useCreateAtom((ctx) =>
      getStyleByArray(ctx.spy(topOffsetsAtom), '--table-resizer-top-offset'),
    );
    const tableResizerStickyTopOffsetsAtom = useCreateAtom((ctx) =>
      getStyleByArray(
        ctx.spy(stickyTopOffsetsAtom),
        '--table-column-sticky-top-offset',
      ),
    );
    const tableRowGridColumn = useCreateAtom(
      (ctx) => `--table-row-grid-column: span ${ctx.spy(sizesLength)}`,
    );
    const tableOverScrollDisplayAtom = useCreateAtom((ctx) =>
      ctx.spy(resizingAtom) ? '--table-over-scroll-display: block' : '',
    );
    const tableHeaderZIndexAtom = useCreateAtom(
      (ctx) => `--table-header-z-index: ${ctx.spy(headerZIndexAtom)};`,
    );

    return (
      <div
        {...otherProps}
        className={cnTableBody(null, [
          cnMixScrollBar(),
          randomClass,
          className,
        ])}
        ref={useForkRef([ref, bodyRef])}
      >
        <Styles
          className={randomClass}
          atoms={[
            tableBodyHeightAtom,
            tableBodyWidthAtom,
            tableHeaderHeightAtom,
            tableBodySpaceTopAtom,
            tableGrigColumnsLengthAtom,
            tableGridTemplateColumnsAtom,
            tableRowGridColumn,
            tableOverScrollDisplayAtom,
            tableHeaderZIndexAtom,
            tableColumnSizesAtom,
            tableColumnLeftOffsetsAtom,
            tableColumnRightOffsetsAtom,
            tableResizerTopOffsetsAtom,
            tableResizerStickyTopOffsetsAtom,
          ]}
        />
        {children}
      </div>
    );
  },
);

export const TableBody: TableBodyComponent = forwardRef((props, ref) => {
  const {
    children,
    spaceTopAtom,
    topOffsetsAtom,
    headerHeightAtom,
    lowHeadersAtom,
    resizersRefsAtom,
    header,
    body,
    resizable,
    stickyTopOffsetsAtom,
    stickyHeader,
    headerZIndex,
    intersectingColumnsAtom,

    ...otherProps
  } = props;

  const propsAtom = useSendToAtom(props);
  const headerZIndexAtom = usePropAtom(propsAtom, 'headerZIndex');
  const resizableAtom = usePropAtom(propsAtom, 'resizable');

  const bodyRef = useRef<HTMLDivElement>(null);

  const [blocks] = useAtom((ctx) => {
    const lowHeaders = ctx.spy(lowHeadersAtom);
    const resizersRefs = ctx.spy(resizersRefsAtom);
    return lowHeaders.map(
      ({ isSeparator, width, minWidth, maxWidth, title }, index) => {
        const currentSeparatorWidth = title
          ? separatorLargeWidth
          : separatorWidth;

        return isSeparator
          ? {
              ref: resizersRefs[index],
              maxWidth: currentSeparatorWidth,
              minWidth: currentSeparatorWidth,
              width: currentSeparatorWidth,
            }
          : {
              ref: resizersRefs[index],
              minWidth: minWidth || columnDefaultMinWidth,
              maxWidth,
              width,
            };
      },
    );
  });

  const { handlersAtom, sizesAtom, activeIndexAtom, resizingAtom } =
    useResizableColumns({
      resizable,
      container: bodyRef,
      blocks,
    });

  return (
    <TableBodyRoot
      {...otherProps}
      ref={useForkRef([ref, bodyRef])}
      headerHeightAtom={headerHeightAtom}
      spaceTopAtom={spaceTopAtom}
      sizesAtom={sizesAtom}
      topOffsetsAtom={topOffsetsAtom}
      stickyTopOffsetsAtom={stickyTopOffsetsAtom}
      headerZIndexAtom={headerZIndexAtom}
      resizingAtom={resizingAtom}
    >
      <div className={cnTableBody('OverScroll')} />
      {header}
      <div
        className={cnTableBody('Separator', { sticky: stickyHeader }, [
          cnTableCell(),
        ])}
      />
      <TableSeparatorTitles lowHeadersAtom={lowHeadersAtom} />
      <TableResizers
        lowHeadersAtom={lowHeadersAtom}
        resizersRefsAtom={resizersRefsAtom}
        handlersAtom={handlersAtom}
        resizableAtom={resizableAtom}
        activeIndexAtom={activeIndexAtom}
        intersectingColumnsAtom={intersectingColumnsAtom}
      />
      <TableVirtualScrollSpaceTop />
      {body}
    </TableBodyRoot>
  );
});
