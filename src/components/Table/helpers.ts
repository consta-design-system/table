import { useCreateAtom } from '@consta/uikit/__internal__/src/utils/state/useCreateAtom';
import { getElementSize } from '@consta/uikit/useResizeObserved';
import { AtomMut } from '@reatom/core';
import { useAtom, useCtx } from '@reatom/npm-react';
import React, { createRef } from 'react';

import { useResizeObservedAtom } from '##/hooks/useResizeObservedAtom';
import { get, set } from '##/utils/object/get';

import { Header, Position, TableColumn } from './types';

export const columnDefaultMinWidth = 80;
export const separatorWidth = 8;
export const separatorLargeWidth = 24;

type TableColumnWidthKey<T> = TableColumn<T> & { key: string };

const reduceSum = (previousValue: number, currentValue: number) =>
  previousValue + currentValue;

const getLastChildrenCount = <T>(columns: TableColumn<T>[]) => {
  let count = 0;

  const traverse = (cols: TableColumn<T>[]) => {
    cols.forEach((item: TableColumn<T>) => {
      if (item.columns?.length) {
        traverse(item.columns);
      } else {
        count++;
      }
    });
  };

  traverse(columns);

  return count;
};

type MapColumnsItem = { columns?: MapColumnsItem[] };

const mapColumns = <T extends MapColumnsItem>(
  columns: T[],
  fn: (item: T, index: (string | number)[]) => void,
  stopRef: { current: boolean } = { current: false },
) => {
  let index: (string | number)[] = [0];

  while (
    // @ts-ignore, первый элемент всегда number
    index[0] <= columns.length - 1 &&
    get(columns, index)
  ) {
    if (stopRef.current) {
      break;
    }
    const currentIndex = [...index];
    const item = get<T>(columns, currentIndex);

    fn(item, currentIndex);

    if (item.columns?.length) {
      index = [...currentIndex, 'columns', 0];
    }

    if (!item.columns?.length) {
      const nextIndex = [
        ...currentIndex.slice(0, -1),
        Number(currentIndex[currentIndex.length - 1]) + 1,
      ];
      if (get<MapColumnsItem>(columns, nextIndex)) {
        index = nextIndex;
      } else {
        if (currentIndex.length === 1) {
          index = [Number(currentIndex[0]) + 1];
          continue;
        }
        let d = 1;

        while (true) {
          const upIndex = currentIndex.slice(0, -d * 2);
          const nextIndex = [
            ...upIndex.slice(0, -1),
            Number(upIndex[upIndex.length - 1]) + 1,
          ];
          if (!upIndex.length) {
            break;
          }

          if (get<MapColumnsItem>(columns, nextIndex)) {
            index = nextIndex;
            break;
          }
          // @ts-ignore, первый элемент всегда number
          if (nextIndex[0] > columns.length - 1) {
            index = nextIndex;
            break;
          }

          d += 1;
        }
      }
    }
  }
};

const pushByKey = <T>(
  pushed: TableColumnWidthKey<T>,
  inColumns: TableColumnWidthKey<T>[],
) => {
  let needAdd = true;
  const stopRef = { current: false };

  mapColumns<TableColumnWidthKey<T>>(
    inColumns,
    (item) => {
      if (pushed.key === item.key) {
        needAdd = false;
        stopRef.current = true;
      }
    },
    stopRef,
  );

  if (!needAdd) {
    return;
  }

  const keySplited = pushed.key.split('-');
  const parentKey = keySplited.slice(0, keySplited.length - 1).join('-');

  if (!parentKey) {
    inColumns.push(pushed);
    return;
  }

  mapColumns<TableColumnWidthKey<T>>(inColumns, (item, index) => {
    if (parentKey === item.key) {
      const pushIndex = [...index, 'columns'];

      set(inColumns, pushIndex, [
        ...get<TableColumnWidthKey<T>[]>(inColumns, pushIndex),
        pushed,
      ]);
    }
  });
};

const pushByIndex = <T>(
  index: (string | number)[],
  columns: TableColumn<T>[],
  inColumns: TableColumnWidthKey<T>[],
  pinned?: 'left' | 'right',
) => {
  let i = index.length - 1;
  while (i >= 0) {
    const currentI = i;
    i--;

    const tree = index.slice(0, index.length - currentI);

    if (tree[tree.length - 1] === 'columns') {
      continue;
    }

    pushByKey(
      {
        ...get<TableColumn<T>>(columns, tree),
        columns: [],
        pinned,
        key: tree.filter((el) => el !== 'columns').join('-'),
      },
      inColumns,
    );
  }
};

const transformPinnedColumns = <T>(columns: TableColumn<T>[]) => {
  const pinnedLeftColumns: TableColumnWidthKey<T>[] = [];
  const pinnedRightColumns: TableColumnWidthKey<T>[] = [];
  const otherColumns: TableColumnWidthKey<T>[] = [];
  const notPinnedColumns: TableColumnWidthKey<T>[] = [];

  mapColumns<TableColumn<T>>(columns, (item, index) => {
    if (!item.columns?.length && item.pinned === 'left') {
      pushByIndex(index, columns, pinnedLeftColumns, 'left');
      return;
    }
    if (!item.columns?.length && item.pinned === 'right') {
      pushByIndex(index, columns, pinnedRightColumns, 'right');
      return;
    }
    if (item.columns?.length || item.isSeparator || item.accessor) {
      pushByIndex(index, columns, otherColumns);
    }
  });

  mapColumns<TableColumnWidthKey<T>>(otherColumns, (item) => {
    if (item.columns?.length || item.isSeparator || item.accessor) {
      pushByKey(item, notPinnedColumns);
    }
  });

  return [...pinnedLeftColumns, ...notPinnedColumns, ...pinnedRightColumns];
};

export const transformColumns = <T>(
  columns: TableColumn<T>[],
  maxLevel: number,
): Array<Header<T>>[] => {
  const stack = [{ columns, index: 0 }];
  const headersArr: Array<Header<T>>[] = [];
  let col = 0;

  while (stack.length) {
    const level = stack.length - 1;
    const node = stack[level];
    const item = node.columns[node.index] as Header<T>;

    if (item) {
      if (!headersArr[level]) headersArr[level] = [];
      const topHeaderGridIndex = stack[0].index;
      const prevItem = headersArr[level][headersArr[level].length - 1];
      const gridIndex = prevItem
        ? prevItem.position.gridIndex + (prevItem.position.colSpan || 1)
        : 0;
      const mainId = level === 0 ? col++ : item.colId ?? 0;

      const handledItem: Header<T> & {
        position: Position;
        colId?: number;
        parentId?: number;
      } = {
        ...item,
        position: {
          topHeaderGridIndex,
          gridIndex,
          level,
        },
      };

      if (level === 0) {
        handledItem.colId = mainId;
      }

      if (!handledItem.columns?.length) {
        handledItem.position.rowSpan = maxLevel - level;
        headersArr[level].push(handledItem);
        node.index++;
      } else {
        // TODO: Заменитть на функцию обхода по дереву, чтоб без рекурсии
        handledItem.position.colSpan = getLastChildrenCount(
          handledItem.columns,
        );
        headersArr[level].push(handledItem);
        stack.push({
          columns: handledItem.columns.map((el) => ({
            ...el,
            colId: col++,
            parentId: mainId,
          })),
          index: 0,
        });
      }
    } else {
      stack.pop();
      if (stack[stack.length - 1]) stack[stack.length - 1].index++;
    }
  }

  return headersArr;
};

export const getMaxLevel = <T>(columns: TableColumn<T>[]) => {
  let count = 0;

  const traverse = (cols: TableColumn<T>[], level = 1) => {
    if (level > count) count = level;
    cols.forEach((item: TableColumn<T>) => {
      if (item.columns?.length) {
        traverse(item.columns, level + 1);
      }
    });
  };

  traverse(columns);

  return count;
};

const getIsFirst = <T>(columns: Header<T>[], column: Header<T>): boolean => {
  // TODO: нужно проверить с renderCell
  const { colId, parentId, position, accessor } = column;
  if (position.level === 0) {
    return colId === 0;
  }
  const parent = columns.find((el) => el.colId === parentId);
  return !!(
    parent?.columns?.[0]?.accessor === accessor &&
    (parent ? getIsFirst(columns, parent) : false)
  );
};

export type HeaderData<T> = {
  headersAtom: AtomMut<Header<T>[][]>;
  flattenedHeadersAtom: AtomMut<Header<T>[]>;
  lowHeadersAtom: AtomMut<TableColumn<T>[]>;
  headerRowsHeightsAtom: AtomMut<number[]>;
  resizerTopOffsetsAtom: AtomMut<number[]>;
  stickyTopOffsetsAtom: AtomMut<number[]>;
  headerHeightAtom: AtomMut<number>;
  resizersRefsAtom: AtomMut<React.RefObject<HTMLDivElement>[]>;
  headerCellsRefsAtom: AtomMut<React.RefObject<HTMLDivElement>[]>;
  stickyLeftOffsetsAtom: AtomMut<number[]>;
  stickyRightOffsetsAtom: AtomMut<number[]>;
  bordersFlattenedHeadersAtom: AtomMut<[boolean, boolean, boolean][]>;
  intersectingColumnsAtom: AtomMut<boolean[]>;
  rightNoVisibleItemsAtom: AtomMut<number>;
  leftNoVisibleItemsAtom: AtomMut<number>;
};

const getLowHeaders = <T>(columns: TableColumnWidthKey<T>[]) => {
  const lowHeaders: TableColumnWidthKey<T>[] = [];
  mapColumns<TableColumnWidthKey<T>>(columns, (item) => {
    if (!item.columns?.length) {
      lowHeaders.push(item);
    }
  });
  return lowHeaders;
};

const getStickyTopOffsets = <T>(
  flattenedHeaders: Header<T>[],
  headerRowsHeights: number[],
) => {
  const stickyTopOffsets: number[] = [];
  for (let index = 0; index < flattenedHeaders.length; index++) {
    const column = flattenedHeaders[index];
    stickyTopOffsets.push(
      headerRowsHeights.slice(0, column.position!.level).reduce(reduceSum, 0),
    );
  }
  return stickyTopOffsets;
};

const getResizerTopOffsets = <T>(
  flattenedHeaders: Header<T>[],
  lowHeaders: TableColumnWidthKey<T>[],
  stickyTopOffsets: number[],
) => {
  const resizerTopOffsets: number[] = [];

  for (let index = 0; index < lowHeaders.length; index++) {
    const topOffsetIndex = flattenedHeaders.findIndex(
      (item) => item.key === lowHeaders[index].key,
    );

    resizerTopOffsets.push(stickyTopOffsets[topOffsetIndex]);
  }
  return resizerTopOffsets;
};

const getFlattenedHeadersLowCellsKeys = <T>(flattenedHeaders: Header<T>[]) => {
  const lowCells = flattenedHeaders.map((flattenedHeaderCell) => {
    const keys: string[] = [];
    mapColumns<Header<T>>([flattenedHeaderCell], (item, index) => {
      if (!item.columns?.length) {
        keys.push(item.key);
      }
    });
    return keys;
  });

  return lowCells;
};

const getHeaderStickyLeftOffsets = <T>(
  lowCellsKeys: string[][],
  lowHeaders: TableColumnWidthKey<T>[],
) => {
  return lowCellsKeys.map((keys) =>
    Math.min(
      ...keys.map((key) => lowHeaders.findIndex((item) => item.key === key)),
    ),
  );
};

const getHeaderStickyRightOffsets = <T>(
  lowCellsKeys: string[][],
  lowHeaders: TableColumnWidthKey<T>[],
) => {
  return lowCellsKeys.map((keys) =>
    Math.max(
      ...keys.map((key) => lowHeaders.findIndex((item) => item.key === key)),
    ),
  );
};

export const useHeaderData = <T>(
  columnsAtom: AtomMut<TableColumn<T>[]>,
  virtualScrollAtom: AtomMut<boolean | undefined | [boolean, boolean]>,
): HeaderData<T> => {
  const horizontalVirtualScrollAtom = useCreateAtom((ctx) => {
    const virtualScroll = ctx.spy(virtualScrollAtom) || false;
    return Array.isArray(virtualScroll) ? virtualScroll[0] : virtualScroll;
  });

  const columnsWithPinnedAtom = useCreateAtom((ctx) =>
    transformPinnedColumns(ctx.spy(columnsAtom)),
  );

  const headersAtom = useCreateAtom((ctx) => {
    const columnsWithPinned = ctx.spy(columnsWithPinnedAtom);
    return transformColumns(columnsWithPinned, getMaxLevel(columnsWithPinned));
  });

  const flattenedHeadersAtom = useCreateAtom((ctx) => {
    const headers = ctx.spy(headersAtom);
    return headers.flat().map((column, index, array) => ({
      ...column,
      position: {
        ...column.position,
        isFirst: getIsFirst(array, column),
        width: column.width || 'auto',
      },
    })) as Header<T>[];
  });

  const flattenedHeadersLengthAtom = useCreateAtom(
    (ctx) => ctx.spy(flattenedHeadersAtom).length,
  );

  const headerCellsRefsAtom = useCreateAtom((ctx) =>
    new Array(ctx.spy(flattenedHeadersLengthAtom))
      .fill(null)
      .map(createRef<HTMLDivElement>),
  );

  const headerCellsHeightsAtom = useResizeObservedAtom(
    useAtom(headerCellsRefsAtom)[0],
    (el) => getElementSize(el).height,
  );

  const headerCellsHeightsHashAtom = useCreateAtom((ctx) => {
    const headerCellsHeights = ctx.spy(headerCellsHeightsAtom);
    return headerCellsHeights.join('-');
  });

  const headerRowsHeightsAtom = useCreateAtom((ctx) => {
    const headers = ctx.spy(headersAtom);
    const flattenedHeaders = ctx.spy(flattenedHeadersAtom);
    ctx.spy(headerCellsHeightsHashAtom);
    const headerCellsHeights = ctx.get(headerCellsHeightsAtom);

    return headers.map((arr, index) => {
      const flattenedHeadersWithHeights = flattenedHeaders.map((item, i) => ({
        ...item,
        position: { ...item.position, height: headerCellsHeights[i] },
      }));
      return Math.min.apply(
        null,
        flattenedHeadersWithHeights
          .filter(
            (col: TableColumn<T> & { position: Position }) =>
              col.position.level === index,
          )
          .map((item, i) => item.position.height),
      );
    });
  });

  const lowHeadersAtom = useCreateAtom((ctx) =>
    getLowHeaders(ctx.spy(columnsWithPinnedAtom)),
  );

  const lowHeaderslengthAtom = useCreateAtom(
    (ctx) => ctx.spy(lowHeadersAtom).length,
  );

  // const resizersRefs = useRefs<HTMLDivElement>(lowHeaders.length);

  const resizersRefsAtom = useCreateAtom((ctx) =>
    new Array(ctx.spy(lowHeaderslengthAtom))
      .fill(null)
      .map(createRef<HTMLDivElement>),
  );

  const headerHeightAtom = useCreateAtom((ctx) =>
    ctx.spy(headerRowsHeightsAtom).reduce(reduceSum),
  );

  const stickyTopOffsetsAtom = useCreateAtom((ctx) =>
    getStickyTopOffsets(
      ctx.spy(flattenedHeadersAtom),
      ctx.spy(headerRowsHeightsAtom),
    ),
  );

  const resizerTopOffsetsAtom = useCreateAtom((ctx) =>
    getResizerTopOffsets(
      ctx.spy(flattenedHeadersAtom),
      ctx.spy(lowHeadersAtom),
      ctx.spy(stickyTopOffsetsAtom),
    ),
  );

  const flattenedHeadersLowCellsKeysAtom = useCreateAtom((ctx) =>
    getFlattenedHeadersLowCellsKeys(ctx.spy(flattenedHeadersAtom)),
  );

  const stickyLeftOffsetsAtom = useCreateAtom((ctx) =>
    getHeaderStickyLeftOffsets(
      ctx.spy(flattenedHeadersLowCellsKeysAtom),
      ctx.spy(lowHeadersAtom),
    ),
  );

  const stickyRightOffsetsAtom = useCreateAtom((ctx) =>
    getHeaderStickyRightOffsets(
      ctx.spy(flattenedHeadersLowCellsKeysAtom),
      ctx.spy(lowHeadersAtom),
    ),
  );

  const bordersFlattenedHeadersAtom = useCreateAtom((ctx) => {
    const flattenedHeaders = ctx.spy(flattenedHeadersAtom);
    const lowHeaders = ctx.spy(lowHeadersAtom);
    return flattenedHeaders.map((flattenedHeadersColumn, index) => {
      let prevLowKey = '';
      const stopRef = { current: false };
      mapColumns(
        [flattenedHeadersColumn],
        (col) => {
          if (!col.columns?.length) {
            prevLowKey = col.key;
            stopRef.current = true;
          }
        },
        stopRef,
      );

      const lowIndex = lowHeaders.findIndex((col) => col.key === prevLowKey);

      return [
        !flattenedHeadersColumn.position.isFirst &&
          !(
            flattenedHeadersColumn.pinned !== 'left' &&
            lowHeaders[lowIndex - 1]?.pinned === 'left'
          ),
        flattenedHeadersColumn.pinned === 'left' &&
          flattenedHeaders[index + 1]?.pinned !== 'left',
        flattenedHeadersColumn.position.level !== 0,
      ];
    }) as [boolean, boolean, boolean][];
  });

  const intersectingColumnsAtom = useCreateAtom<boolean[]>([]);

  const leftNoVisibleItemsAtom = useCreateAtom((ctx) => {
    const intersectingColumns = ctx.spy(intersectingColumnsAtom);
    const horizontalVirtualScroll = ctx.spy(horizontalVirtualScrollAtom);

    if (!horizontalVirtualScroll) {
      return 0;
    }

    if (intersectingColumns.length === 0) {
      return ctx.get(lowHeadersAtom).length;
    }

    let offset = 0;

    while (intersectingColumns[offset] === false) {
      offset++;
    }

    return offset;
  });

  const rightNoVisibleItemsAtom = useCreateAtom((ctx) => {
    const intersectingColumns = ctx.spy(intersectingColumnsAtom);

    const horizontalVirtualScroll = ctx.spy(horizontalVirtualScrollAtom);

    if (!horizontalVirtualScroll) {
      return 0;
    }

    let offset = intersectingColumns.length - 1;

    while (intersectingColumns[offset] === false) {
      offset--;
    }

    return intersectingColumns.length - offset - 1;
  });

  return {
    headersAtom,
    flattenedHeadersAtom,
    lowHeadersAtom: lowHeadersAtom as unknown as AtomMut<TableColumn<T>[]>,
    headerRowsHeightsAtom,
    resizerTopOffsetsAtom,
    headerHeightAtom,
    resizersRefsAtom,
    stickyTopOffsetsAtom,
    stickyLeftOffsetsAtom,
    stickyRightOffsetsAtom,
    headerCellsRefsAtom,
    bordersFlattenedHeadersAtom,
    intersectingColumnsAtom,
    rightNoVisibleItemsAtom,
    leftNoVisibleItemsAtom,
  };
};
