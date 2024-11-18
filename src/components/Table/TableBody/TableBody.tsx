import './TableBody.css';

import { cnMixScrollBar } from '@consta/uikit/MixScrollBar';
import { useForkRef } from '@consta/uikit/useForkRef';
import {
  getElementSize,
  useResizeObserved,
} from '@consta/uikit/useResizeObserved';
import React, { forwardRef, useMemo, useRef } from 'react';

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
import { TableBodyComponent } from '../types';
import {
  getGridTemplate,
  getStyleByArray,
  getStyleLeftOffsetsForStickyColumns,
  getStyleRightOffsetsForStickyColumns,
  printSize,
} from './helpers';
import { useResizableColumns } from './useResizableColumns';

export const cnTableBody = cn('TableBody');

export const TableBody: TableBodyComponent = forwardRef((props, ref) => {
  const {
    className,
    children,
    spaceTop,
    topOffsets,
    style = {},
    headerHeight,
    lowHeaders,
    resizersRefs,
    header,
    body,
    resizable,
    stickyTopOffsets,
    stickyHeader,
    headerZIndex,
    ...otherProps
  } = props;

  const bodyRef = useRef<HTMLDivElement>(null);

  const [bodySize] = useResizeObserved(
    useMemo(() => [bodyRef], [bodyRef]),
    getElementSize,
  );

  const blocks = useMemo(
    () =>
      lowHeaders.map(
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
      ),
    [lowHeaders],
  );

  const { handlers, sizes, activeIndex, resizing } = useResizableColumns({
    resizable,
    container: bodyRef,
    blocks,
  });

  return (
    <div
      {...otherProps}
      className={cnTableBody(null, [cnMixScrollBar(), className])}
      style={{
        ...style,
        ['--table-body-height' as string]: `${bodySize.height}px`,
        ['--table-body-width' as string]: `${bodySize.width}px`,
        ['--table-header-height' as string]: `${headerHeight}px`,
        ['--table-body-space-top' as string]: `${spaceTop}px`,
        ['--table-grid-columns-length' as string]: `${sizes.length}`,
        ['--table-grid-template-columns' as string]: useMemo(
          () => getGridTemplate(sizes),
          [sizes.length],
        ),
        ...useMemo(
          () => getStyleByArray(sizes, '--table-column-size', printSize),
          [sizes],
        ),
        ...useMemo(
          () => getStyleLeftOffsetsForStickyColumns(sizes),
          [sizes.length],
        ),
        ...useMemo(
          () => getStyleRightOffsetsForStickyColumns(sizes),
          [sizes.length],
        ),
        ...useMemo(
          () => getStyleByArray(topOffsets, '--table-resizer-top-offset'),
          [topOffsets],
        ),
        ...useMemo(
          () =>
            getStyleByArray(
              stickyTopOffsets,
              '--table-column-sticky-top-offset',
            ),
          [stickyTopOffsets],
        ),
        ['--table-row-grid-column' as string]: `span ${lowHeaders.length}`,
        ['--table-header-z-index' as string]: headerZIndex,
        ['--table-over-scroll-display' as string]: resizing
          ? 'block'
          : undefined,
      }}
      ref={useForkRef([ref, bodyRef])}
    >
      <div className={cnTableBody('OverScroll')} />
      {header}
      <div
        className={cnTableBody('Separator', { sticky: stickyHeader }, [
          cnTableCell(),
        ])}
      />
      <TableSeparatorTitles lowHeaders={lowHeaders} />
      <TableResizers
        lowHeaders={lowHeaders}
        resizersRefs={resizersRefs}
        handlers={handlers}
        resizable={resizable}
        activeIndex={activeIndex}
      />
      <TableVirtualScrollSpaceTop />
      {body}
    </div>
  );
});
