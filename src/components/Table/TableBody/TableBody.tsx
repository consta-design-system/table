import './TableBody.css';

import { setRefs } from '@consta/uikit/__internal__/src/utils/setRef';
import {
  factoryComponent,
  onEventEffect,
  propAction,
  resizeObservedAtom,
} from '@consta/uikit/__internal__/src/utils/state';
import { cnMixScrollBar } from '@consta/uikit/MixScrollBar';
import { getElementSize } from '@consta/uikit/useResizeObserved';
import { action, atom, AtomLike, computed } from '@reatom/core';
import { reatomFactoryComponent } from '@reatom/react';
import React, { memo } from 'react';

import { cn } from '##/utils/bem';

import {
  columnDefaultMinWidth,
  separatorLargeWidth,
  separatorWidth,
} from '../model';
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
import { resizableColumns } from './model';

export const cnTableBody = cn('TableBody');

const getRandomHash = () =>
  Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

const Style = reatomFactoryComponent<{
  atom: AtomLike<string>;
  className: string;
}>(() => {
  return ({ atom, className }) => (
    <style>
      {`.${className} {`} {atom()} {`}`}
    </style>
  );
});

const Styles = memo(
  ({ atoms, className }: { atoms: AtomLike<string>[]; className: string }) => (
    <>
      {atoms.map((atom, index) => (
        <Style key={index} atom={atom} className={className} />
      ))}
    </>
  ),
  () => true,
);

const TableBodyRoot: TableBodyRootComponent = factoryComponent(
  (
    {
      headerHeightAtom,
      spaceTopAtom,
      sizesAtom,
      topOffsetsAtom,
      stickyTopOffsetsAtom,
      headerZIndexAtom,
      resizingAtom,
      stickyHeaderAtom,
    },
    propsAtom,
  ) => {
    const randomClassAtom = atom(
      cnTableBody({ instance: getRandomHash() }).split(' ')[1],
    );

    const bodyElementAtom = atom<HTMLDivElement | null>(null);

    const ref = action((el: HTMLDivElement | null) =>
      setRefs([bodyElementAtom.set, propsAtom().ref], el),
    );

    const bodySizeAtom = resizeObservedAtom(bodyElementAtom, getElementSize);

    const bodyOffsetHeightSizeAtom = resizeObservedAtom(
      bodyElementAtom,
      (el) => el?.scrollHeight || 0,
    );

    const tableBodyHorizontalScrollHeightAtom = resizeObservedAtom(
      bodyElementAtom,
      (el) => {
        const clientHeight = el?.clientHeight || 0;
        const offsetHeight = el?.offsetHeight || 0;

        return offsetHeight - clientHeight;
      },
    );

    const tableBodyHorizontalScrollHeightStyleAtom = computed(
      () =>
        `--table-body-horizontal-scroll-height: ${tableBodyHorizontalScrollHeightAtom()}px;`,
    );

    const tableBodyHeightAtom = computed(
      () => `--table-body-height: ${bodySizeAtom().height}px;`,
    );

    const bodyOffsetHeightAtom = computed(
      () => `--table-body-offset-height: ${bodyOffsetHeightSizeAtom()}px;`,
    );

    const tableBodyWidthAtom = computed(
      () => `--table-body-width: ${bodySizeAtom().width}px;`,
    );

    const tableHeaderHeightAtom = computed(
      () => `--table-header-height: ${headerHeightAtom()}px;`,
    );

    const tableBodySpaceTopAtom = computed(
      () => `--table-body-space-top: ${spaceTopAtom()}px;`,
    );

    const sizesLength = computed(() => sizesAtom().length);

    const tableGrigColumnsLengthAtom = computed(
      () => `--table-grid-columns-length: ${sizesLength()};`,
    );

    const tableGridTemplateColumnsAtom = computed(
      () => `--table-grid-template-columns: ${getGridTemplate(sizesLength())};`,
    );

    const tableColumnSizesAtom = computed(() =>
      getStyleByArray(sizesAtom(), '--table-column-size', printSize),
    );

    const tableColumnLeftOffsetsAtom = computed(() =>
      getStyleLeftOffsetsForStickyColumns(sizesLength()),
    );

    const tableColumnRightOffsetsAtom = computed(() =>
      getStyleRightOffsetsForStickyColumns(sizesLength()),
    );

    const tableResizerTopOffsetsAtom = computed(() =>
      getStyleByArray(topOffsetsAtom(), '--table-resizer-top-offset'),
    );

    const tableResizerStickyTopOffsetsAtom = computed(() =>
      getStyleByArray(
        stickyTopOffsetsAtom(),
        '--table-column-sticky-top-offset',
      ),
    );

    const tableRowGridColumn = computed(
      () => `--table-row-grid-column: span ${sizesLength()};`,
    );

    const tableOverScrollDisplayAtom = computed(() =>
      resizingAtom() ? '--table-over-scroll-display: block' : '',
    );

    const tableHeaderZIndexAtom = computed(
      () => `--table-header-z-index: ${headerZIndexAtom()};`,
    );

    const scrollTopAtom = atom(0);

    const scrollBehaviorYAtom = computed<boolean>(() => {
      return (
        scrollTopAtom() === 0 ||
        scrollTopAtom() ===
          (bodyElementAtom()?.scrollHeight || 0) -
            (bodyElementAtom()?.clientHeight || 0)
      );
    });

    const overscrollBehaviorAtom = computed(
      () =>
        `overscroll-behavior-y: ${scrollBehaviorYAtom() ? 'auto' : 'none'};`,
    );

    const headerVisiblePartAtom = computed(() => {
      const stickyHeader = stickyHeaderAtom();
      const headerHeight = headerHeightAtom();
      const scrollTop = scrollTopAtom();
      if (!stickyHeader) {
        return headerHeight - scrollTop >= 0 ? headerHeight - scrollTop : 0;
      }
      return headerHeight;
    });

    const tableHeaderVisiblePartAtomAtom = computed(
      () => `--table-header-visible-part: ${headerVisiblePartAtom()}px;`,
    );

    onEventEffect(bodyElementAtom, 'scroll', (e: Event) => {
      scrollTopAtom.set((e.target as HTMLDivElement).scrollTop);
    });

    return ({
      children,
      className,
      headerHeightAtom,
      spaceTopAtom,
      sizesAtom,
      topOffsetsAtom,
      stickyTopOffsetsAtom,
      headerZIndexAtom,
      resizingAtom,
      stickyHeaderAtom,
      ...otherProps
    }) => (
      <div
        {...otherProps}
        className={cnTableBody(null, [
          cnMixScrollBar(),
          randomClassAtom(),
          className,
        ])}
        ref={ref}
      >
        <Styles
          className={randomClassAtom()}
          atoms={[
            tableBodyHorizontalScrollHeightStyleAtom,
            bodyOffsetHeightAtom,
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
            overscrollBehaviorAtom,
            tableHeaderVisiblePartAtomAtom,
          ]}
        />
        {children}
      </div>
    );
  },
);

export const TableBody: TableBodyComponent = factoryComponent(
  (initProps, propsAtom) => {
    const { lowHeadersAtom, resizersElementsAtom } = initProps;

    const headerZIndexAtom = computed(() => propsAtom().headerZIndex);
    const resizableAtom = computed(() => propsAtom().resizable);
    const stickyHeaderAtom = computed(() => !!propsAtom().stickyHeader);

    const bodyElementAtom = atom<HTMLDivElement | null>(null);

    const ref = action((el: HTMLDivElement | null) =>
      setRefs([bodyElementAtom.set, propsAtom().ref], el),
    );

    const blocksAtom = computed(() => {
      const lowHeaders = lowHeadersAtom();
      const resizersElements = resizersElementsAtom();
      return lowHeaders.map(
        (
          { isSeparator, width, minWidth, maxWidth, title, accessor },
          index,
        ) => {
          const currentSeparatorWidth = title
            ? separatorLargeWidth
            : separatorWidth;

          const element = resizersElements[index]();

          return isSeparator
            ? {
                element,
                maxWidth: currentSeparatorWidth,
                minWidth: currentSeparatorWidth,
                width: currentSeparatorWidth,
              }
            : {
                element,
                minWidth: minWidth || columnDefaultMinWidth,
                maxWidth,
                width,
                accessor,
              };
        },
      );
    });

    const { handlersAtom, sizesAtom, activeIndexAtom, resizingAtom } =
      resizableColumns(
        blocksAtom,
        bodyElementAtom,
        resizableAtom,
        propAction(propsAtom, 'onAfterResize'),
      );

    return ({
      children,
      spaceTopAtom,
      topOffsetsAtom,
      headerHeightAtom,
      lowHeadersAtom,
      resizersElementsAtom,
      header,
      body,
      resizable,
      stickyTopOffsetsAtom,
      stickyHeader,
      headerZIndex,
      intersectingColumnsAtom,
      onAfterResize,
      ...otherProps
    }) => (
      <TableBodyRoot
        {...otherProps}
        ref={ref}
        headerHeightAtom={headerHeightAtom}
        spaceTopAtom={spaceTopAtom}
        sizesAtom={sizesAtom}
        topOffsetsAtom={topOffsetsAtom}
        stickyTopOffsetsAtom={stickyTopOffsetsAtom}
        headerZIndexAtom={headerZIndexAtom}
        resizingAtom={resizingAtom}
        stickyHeaderAtom={stickyHeaderAtom}
      >
        <div className={cnTableBody('OverScroll')} />
        <TableResizers
          lowHeadersAtom={lowHeadersAtom}
          bodyElementAtom={bodyElementAtom}
          resizersElementsAtom={resizersElementsAtom}
          handlersAtom={handlersAtom}
          resizableAtom={resizableAtom}
          activeIndexAtom={activeIndexAtom}
          intersectingColumnsAtom={intersectingColumnsAtom}
          stickyHeaderAtom={stickyHeaderAtom}
        />
        {header}
        <div
          className={cnTableBody('Separator', { sticky: stickyHeader }, [
            cnTableCell(),
          ])}
        />
        <TableSeparatorTitles lowHeadersAtom={lowHeadersAtom} />

        <TableVirtualScrollSpaceTop />
        {body}
      </TableBodyRoot>
    );
  },
);
