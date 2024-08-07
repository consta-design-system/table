import './TableBody.css';

import { cnMixScrollBar } from '@consta/uikit/MixScrollBar';
import { getElementSize } from '@consta/uikit/useComponentSize';
import { useForkRef } from '@consta/uikit/useForkRef';
import { useResizeObserved } from '@consta/uikit/useResizeObserved';
import React, { forwardRef, useMemo, useRef } from 'react';

import { cn } from '##/utils/bem';

import {
  columnDefaultMinWidth,
  seporatorLargeWidth,
  seporatorWidth,
} from '../helpers';
import { cnTableCell } from '../TableCell';
import { TableResizers } from '../TableResizers';
import { TableSeporatorTitles } from '../TableSeporatorTitles';
import { TableVirtualScrollSpaceTop } from '../TableVirtualScrollSpaceTop';
import { TableBodyComponent } from '../types';
import {
  getGridTamplate,
  getStyleByArray,
  getStyleLeftOffestsForStickyColumns,
  getStyleRightOffestsForStickyColumns,
  printSize,
} from './helpers';
import { useResizableColmns } from './useResizableColmns';

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
          const currentSeporatorWidth = title
            ? seporatorLargeWidth
            : seporatorWidth;

          return isSeparator
            ? {
                ref: resizersRefs[index],
                maxWidth: currentSeporatorWidth,
                minWidth: currentSeporatorWidth,
                width: currentSeporatorWidth,
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

  const { handlers, sizes, activeIndex } = useResizableColmns({
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
        ['--table-grid-columns-lenght' as string]: `${sizes.length}`,
        ['--table-grid-template-columns' as string]: useMemo(
          () => getGridTamplate(sizes),
          [sizes.length],
        ),
        ...useMemo(
          () => getStyleByArray(sizes, '--table-column-size', printSize),
          [sizes],
        ),
        ...useMemo(
          () => getStyleLeftOffestsForStickyColumns(sizes),
          [sizes.length],
        ),
        ...useMemo(
          () => getStyleRightOffestsForStickyColumns(sizes),
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
      }}
      ref={useForkRef([ref, bodyRef])}
    >
      {header}
      <div
        className={cnTableBody('Seporator', { sticky: stickyHeader }, [
          cnTableCell(),
        ])}
      />
      <TableSeporatorTitles lowHeaders={lowHeaders} />
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
