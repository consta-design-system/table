import './TableBody.css';

import { useCreateAtom } from '@consta/uikit/__internal__/src/utils/state/useCreateAtom';
import { usePropAtom } from '@consta/uikit/__internal__/src/utils/state/usePickAtom';
import { useSendToAtom } from '@consta/uikit/__internal__/src/utils/state/useSendToAtom';
import { cnMixScrollBar } from '@consta/uikit/MixScrollBar';
import { useForkRef } from '@consta/uikit/useForkRef';
import { getElementSize } from '@consta/uikit/useResizeObserved';
import { AtomMut } from '@reatom/core';
import { useAction, useAtom } from '@reatom/npm-react';
import React, { forwardRef, memo, useMemo, useRef } from 'react';
import { renderToString } from 'react-dom/server';

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
  getAttrByArray,
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
  return useAtom(atom)[0];
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

const StylesT = memo(
  ({ styleAtoms }: { styleAtoms: Record<string, AtomMut<string>> }) => {
    const keys = Object.keys(styleAtoms);
    return (
      <>
        {keys.map((atom, index) => (
          <Style key={index} atom={styleAtoms[atom]} className={className} />
        ))}
      </>
    );
  },
  () => true,
);

const getStyleLinkAttribute = (length: number, name: string, ext?: string) => {
  let i = length;
  const result: Record<string, string> = {};
  while (i > 0) {
    result[`--table-${name}-${i - 1}`] = `attr(data-${name}-${i - 1}${`${
      ext ? ` ${ext}` : ''
    }`})`;
    i--;
  }
  return result as React.CSSProperties;
};

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
      style,
      ...otherProps
    },
    ref,
  ) => {
    const bodyRef = useRef<HTMLDivElement>(null);
    const bodySizeAtom = useResizeObservedAtom(
      useMemo(() => [bodyRef], [bodyRef]),
      getElementSize,
    );
    const bodyOffsetHeightSizeAtom = useResizeObservedAtom(
      useMemo(() => [bodyRef], [bodyRef]),
      (el) => el?.scrollHeight || 0,
    );

    const tableBodyHorizontalScrollHeightAtom = useResizeObservedAtom(
      useMemo(() => [bodyRef], [bodyRef]),
      (el) => {
        const clientHeight = el?.clientHeight || 0;
        const offsetHeight = el?.offsetHeight || 0;

        return offsetHeight - clientHeight;
      },
    );

    const stickyTopOffsetsLengthAtom = useCreateAtom(
      (ctx) => ctx.spy(stickyTopOffsetsAtom).length,
    );
    const topOffsetsLengthAtom = useCreateAtom(
      (ctx) => ctx.spy(topOffsetsAtom).length,
    );
    const sizesLength = useCreateAtom((ctx) => ctx.spy(sizesAtom).length);

    const tableBodyHeightAtom = useCreateAtom(
      (ctx) => `${ctx.spy(bodySizeAtom)[0].height}`,
    );

    const bodyOffsetHeightAtom = useCreateAtom(
      (ctx) => `${ctx.spy(bodyOffsetHeightSizeAtom)}`,
    );

    const tableBodyWidthAtom = useCreateAtom(
      (ctx) => `${ctx.spy(bodySizeAtom)[0].width}`,
    );

    const tableGrigColumnsLengthAtom = useCreateAtom(
      (ctx) => `${ctx.spy(sizesLength)};`,
    );
    const tableGridTemplateColumnsAtom = useCreateAtom(
      (ctx) => `${getGridTemplate(ctx.spy(sizesLength))}`,
    );
    const tableColumnLeftOffsetsAtom = useCreateAtom((ctx) =>
      getStyleLeftOffsetsForStickyColumns(ctx.spy(sizesLength)),
    );
    const tableColumnRightOffsetsAtom = useCreateAtom((ctx) =>
      getStyleRightOffsetsForStickyColumns(ctx.spy(sizesLength)),
    );

    const tableColumnSizesAttrAtom = useCreateAtom((ctx) =>
      getAttrByArray(ctx.spy(sizesAtom), 'column-size'),
    );
    const tableColumnSizesLinksAtom = useCreateAtom((ctx) =>
      getStyleLinkAttribute(ctx.spy(sizesLength), 'column-size', 'px'),
    );
    const tableResizerTopOffsetsAttrAtom = useCreateAtom((ctx) =>
      getAttrByArray(ctx.spy(topOffsetsAtom), 'resizer-top-offset'),
    );
    const tableResizerTopOffsetsLinksAtom = useCreateAtom((ctx) =>
      getStyleLinkAttribute(
        ctx.spy(topOffsetsLengthAtom),
        'resizer-top-offset',
        'px',
      ),
    );

    const tableResizerStickyTopOffsetsAttrAtom = useCreateAtom((ctx) =>
      getAttrByArray(ctx.spy(stickyTopOffsetsAtom), 'column-sticky-top-offset'),
    );
    const tableResizerStickyTopOffsetsLinksAtom = useCreateAtom((ctx) =>
      getStyleLinkAttribute(
        ctx.spy(stickyTopOffsetsLengthAtom),
        'column-sticky-top-offset',
        'px',
      ),
    );
    const tableRowGridColumn = useCreateAtom(
      (ctx) => `span ${ctx.spy(sizesLength)}`,
    );

    const tableOverScrollDisplayAtom = useCreateAtom((ctx) =>
      ctx.spy(resizingAtom) ? 'block' : undefined,
    );
    const tableHeaderZIndexAtom = useCreateAtom(
      (ctx) => `${ctx.spy(headerZIndexAtom)};`,
    );

    return (
      <div
        {...otherProps}
        style={{
          ...style,
          [`--table-header-z-index` as string]: useAtom(headerZIndexAtom)[0],
          [`--table-grid-columns-length` as string]: useAtom(
            tableGrigColumnsLengthAtom,
          )[0],
          [`--table-grid-template-columns` as string]: useAtom(
            tableGridTemplateColumnsAtom,
          )[0],
          [`--table-row-grid-column` as string]: useAtom(tableRowGridColumn)[0],
          [`--table-over-scroll-display` as string]: useAtom(
            tableOverScrollDisplayAtom,
          )[0],
          [`--table-header-z-index` as string]: useAtom(
            tableHeaderZIndexAtom,
          )[0],
          ...useAtom(tableColumnSizesLinksAtom)[0],
          ...useAtom(tableColumnLeftOffsetsAtom)[0],
          ...useAtom(tableColumnRightOffsetsAtom)[0],
          ...useAtom(tableResizerTopOffsetsLinksAtom)[0],
          ...useAtom(tableResizerStickyTopOffsetsLinksAtom)[0],
        }}
        {...useAtom(tableResizerStickyTopOffsetsAttrAtom)[0]}
        {...useAtom(tableResizerTopOffsetsAttrAtom)[0]}
        {...useAtom(tableColumnSizesAttrAtom)[0]}
        data-body-space-top={useAtom(spaceTopAtom)[0]}
        data-header-height={useAtom(headerHeightAtom)[0]}
        data-body-width={useAtom(tableBodyWidthAtom)[0]}
        data-body-offset-height={useAtom(bodyOffsetHeightAtom)[0]}
        data-body-height={useAtom(tableBodyHeightAtom)[0]}
        data-body-horizontal-scroll-height={
          useAtom(tableBodyHorizontalScrollHeightAtom)[0]
        }
        className={cnTableBody(null, [cnMixScrollBar(), className])}
        ref={useForkRef([ref, bodyRef])}
      >
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
  const bodyElAtom = useCreateAtom<HTMLDivElement | null>(null);
  const setBodyEl = useAction((ctx, el: HTMLDivElement) => bodyElAtom(ctx, el));

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
      ref={useForkRef([ref, bodyRef, setBodyEl])}
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
        bodyElAtom={bodyElAtom}
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
