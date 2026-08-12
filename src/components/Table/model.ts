import {
  rangeAtom,
  resizeObservedAtom,
} from '@consta/uikit/__internal__/src/utils/state';
import { getElementSize } from '@consta/uikit/useResizeObserved';
import { atom, AtomLike, computed, peek } from '@reatom/core';

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

  const keySplit = pushed.key.split('-');
  const parentKey = keySplit.slice(0, keySplit.length - 1).join('-');

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

  mapColumns<TableColumn<T>>(columns, (item, index) => {
    if (!item.columns?.length && item.pinned === 'left') {
      pushByIndex(index, columns, pinnedLeftColumns, 'left');
      return;
    }
    if (!item.columns?.length && item.pinned === 'right') {
      pushByIndex(index, columns, pinnedRightColumns, 'right');
      return;
    }
    if (!item.columns?.length) {
      pushByIndex(index, columns, otherColumns);
    }
  });
  return [...pinnedLeftColumns, ...otherColumns, ...pinnedRightColumns];
};

export const transformColumns = <T>(
  columns: TableColumn<T>[],
  maxLevel: number,
): Array<Header<T>>[] => {
  const stack = [
    { columns, index: 0, parentIsFirst: true, parentIsLastPinnedLeft: false },
  ];
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

      const mainId = level === 0 ? col++ : (item.colId ?? 0);
      const isFirst = gridIndex === 0 && node.parentIsFirst;
      let isLastPinnedLeft = false;
      if (level === 0) {
        const nextItem = node.columns[node.index + 1];
        isLastPinnedLeft =
          item.pinned === 'left' && nextItem && nextItem.pinned !== 'left';
      } else {
        const isLastChild = node.index === node.columns.length - 1;
        isLastPinnedLeft = node.parentIsLastPinnedLeft && isLastChild;
      }

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
          isFirst,
          isLastPinnedLeft,
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
          parentIsFirst: isFirst,
          parentIsLastPinnedLeft: isLastPinnedLeft,
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

const getHeaderStickyOffsets = <T>(
  lowCellsKeys: string[][],
  lowHeaders: TableColumnWidthKey<T>[],
  method: 'min' | 'max',
) => {
  return lowCellsKeys.map((keys) =>
    Math[method](
      ...keys.map((key) => lowHeaders.findIndex((item) => item.key === key)),
    ),
  );
};

export const headerDataModel = <T>(
  columnsAtom: AtomLike<TableColumn<T>[]>,
  virtualScrollAtom: AtomLike<boolean | undefined | [boolean, boolean]>,
) => {
  const horizontalVirtualScrollAtom = computed(() => {
    const virtualScroll = virtualScrollAtom() || false;
    return Array.isArray(virtualScroll) ? virtualScroll[0] : virtualScroll;
  });

  const columnsWithPinnedAtom = computed(() =>
    transformPinnedColumns(columnsAtom()),
  );

  const headersAtom = computed(() => {
    const columnsWithPinned = columnsWithPinnedAtom();
    return transformColumns(columnsWithPinned, getMaxLevel(columnsWithPinned));
  });

  const flattenedHeadersAtom = computed(() => {
    const headers = headersAtom();
    const res = headers.flat().map((column) => ({
      ...column,
      position: {
        ...column.position,
        width: column.width || 'auto',
      },
    })) as Header<T>[];
    return res;
  });

  const headerCellsElementsAtom = rangeAtom<HTMLDivElement | null>(
    computed(() => flattenedHeadersAtom().length),
    null,
  );

  const headerCellsHeightsAtom = resizeObservedAtom(
    computed(() => headerCellsElementsAtom().map((elAtom) => peek(elAtom))),
    (el) => getElementSize(el).height,
  );

  const headerCellsHeightsHashAtom = computed(() =>
    headerCellsHeightsAtom().join('-'),
  );

  const headerRowsHeightsAtom = computed(() => {
    headerCellsHeightsHashAtom();
    const headers = headersAtom();
    const flattenedHeaders = flattenedHeadersAtom();

    const headerCellsHeights = peek(headerCellsHeightsAtom);

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

  const lowHeadersAtom = computed(() => getLowHeaders(columnsWithPinnedAtom()));

  const resizersElementsAtom = rangeAtom<HTMLDivElement | null>(
    computed(() => lowHeadersAtom().length),
    null,
  );

  const headerHeightAtom = computed(() =>
    headerRowsHeightsAtom().reduce(reduceSum),
  );

  const stickyTopOffsetsAtom = computed(() =>
    getStickyTopOffsets(flattenedHeadersAtom(), headerRowsHeightsAtom()),
  );

  const resizerTopOffsetsAtom = computed(() =>
    getResizerTopOffsets(
      flattenedHeadersAtom(),
      lowHeadersAtom(),
      stickyTopOffsetsAtom(),
    ),
  );

  const flattenedHeadersLowCellsKeysAtom = computed(() =>
    getFlattenedHeadersLowCellsKeys(flattenedHeadersAtom()),
  );

  const stickyLeftOffsetsAtom = computed(() =>
    getHeaderStickyOffsets(
      flattenedHeadersLowCellsKeysAtom(),
      lowHeadersAtom(),
      'min',
    ),
  );

  const stickyRightOffsetsAtom = computed(() =>
    getHeaderStickyOffsets(
      flattenedHeadersLowCellsKeysAtom(),
      lowHeadersAtom(),
      'max',
    ),
  );

  const bordersFlattenedHeadersAtom = computed(() => {
    const flattenedHeaders = flattenedHeadersAtom();
    const lowHeaders = lowHeadersAtom();
    return flattenedHeaders.map((flattenedHeadersColumn) => {
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
        flattenedHeadersColumn.position.isLastPinnedLeft,
        flattenedHeadersColumn.position.level !== 0,
      ];
    }) as [boolean, boolean, boolean][];
  });

  const intersectingColumnsAtom = atom<boolean[]>([]);

  const leftNoVisibleItemsAtom = computed(() => {
    const intersectingColumns = intersectingColumnsAtom();
    const horizontalVirtualScroll = horizontalVirtualScrollAtom();

    if (!horizontalVirtualScroll) {
      return 0;
    }

    if (intersectingColumns.length === 0) {
      return peek(lowHeadersAtom).length;
    }

    let offset = 0;

    while (intersectingColumns[offset] === false) {
      offset++;
    }

    return offset;
  });

  const rightNoVisibleItemsAtom = computed(() => {
    const intersectingColumns = intersectingColumnsAtom();
    const horizontalVirtualScroll = horizontalVirtualScrollAtom();

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
    lowHeadersAtom: lowHeadersAtom as unknown as AtomLike<TableColumn<T>[]>,
    headerRowsHeightsAtom,
    resizerTopOffsetsAtom,
    headerHeightAtom,
    resizersElementsAtom,
    stickyTopOffsetsAtom,
    stickyLeftOffsetsAtom,
    stickyRightOffsetsAtom,
    headerCellsElementsAtom,
    bordersFlattenedHeadersAtom,
    intersectingColumnsAtom,
    rightNoVisibleItemsAtom,
    leftNoVisibleItemsAtom,
  };
};
