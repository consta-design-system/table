import { getElementSize } from '@consta/uikit/useComponentSize';
import { useRefs } from '@consta/uikit/useRefs';
import { useResizeObserved } from '@consta/uikit/useResizeObserved';
import React, { useMemo } from 'react';

import { get, set } from '##/utils/object/get';

import { Header, Position, TableColumn } from './types';

export const columnDefaultMinWidth = 80;
export const seporatorWidth = 8;
export const seporatorLargeWidth = 24;

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

type MapColumsItem = { columns?: MapColumsItem[] };

const mapColums = <T extends MapColumsItem>(
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
      if (get<MapColumsItem>(columns, nextIndex)) {
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

          if (get<MapColumsItem>(columns, nextIndex)) {
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

  mapColums<TableColumnWidthKey<T>>(
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
  const parentkey = keySplited.slice(0, keySplited.length - 1).join('-');

  if (!parentkey) {
    inColumns.push(pushed);
    return;
  }

  mapColums<TableColumnWidthKey<T>>(inColumns, (item, index) => {
    if (parentkey === item.key) {
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
  const pinnetLeftColumns: TableColumnWidthKey<T>[] = [];
  const pinnetRightColumns: TableColumnWidthKey<T>[] = [];
  const otherColumns: TableColumnWidthKey<T>[] = [];
  const notPinnedColumns: TableColumnWidthKey<T>[] = [];

  mapColums<TableColumn<T>>(columns, (item, index) => {
    if (!item.columns?.length && item.pinned === 'left') {
      pushByIndex(index, columns, pinnetLeftColumns, 'left');
      return;
    }
    if (!item.columns?.length && item.pinned === 'right') {
      pushByIndex(index, columns, pinnetRightColumns, 'right');
      return;
    }
    if (item.columns?.length || item.isSeparator || item.accessor) {
      pushByIndex(index, columns, otherColumns);
    }
  });

  mapColums<TableColumnWidthKey<T>>(otherColumns, (item) => {
    if (item.columns?.length || item.isSeparator || item.accessor) {
      pushByKey(item, notPinnedColumns);
    }
  });

  return [...pinnetLeftColumns, ...notPinnedColumns, ...pinnetRightColumns];
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
  headers: Header<T>[][];
  flattenedHeaders: Header<T>[];
  lowHeaders: TableColumn<T>[];
  headerRowsHeights: number[];
  resizerTopOffsets: number[];
  stickyTopOffsets: number[];
  headerHeight: number;
  resizersRefs: React.RefObject<HTMLDivElement>[];
  headerCellsRefs: React.RefObject<HTMLDivElement>[];
  stickyLeftOffsets: number[];
  stickyRightOffsets: number[];
  bordersFlattenedHeaders: [boolean, boolean][];
};

const getlowHeaders = <T>(columns: TableColumnWidthKey<T>[]) => {
  const lowHeaders: TableColumnWidthKey<T>[] = [];
  mapColums<TableColumnWidthKey<T>>(columns, (item) => {
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
    mapColums<Header<T>>([flattenedHeaderCell], (item, index) => {
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

export const useHeaderData = <T>(columns: TableColumn<T>[]): HeaderData<T> => {
  const columnsWinhPinned = useMemo(
    () => transformPinnedColumns(columns),
    [columns],
  );

  const headers = useMemo(
    () => transformColumns(columnsWinhPinned, getMaxLevel(columnsWinhPinned)),
    [columnsWinhPinned],
  );

  const flattenedHeaders = useMemo(() => {
    return headers.flat().map((column, index, array) => ({
      ...column,
      position: {
        ...column.position,
        isFirst: getIsFirst(array, column),

        width: column.width || 'auto',
      },
    }));
  }, [headers]);

  const headerCellsRefs = useRefs<HTMLDivElement>(flattenedHeaders.length, [
    columns,
  ]);

  const headerCellsHeights = useResizeObserved(
    headerCellsRefs,
    (el) => getElementSize(el).height,
  );

  const headerRowsHeights = useMemo(() => {
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
  }, [headers, flattenedHeaders, headerCellsHeights.join('-')]);

  const lowHeaders = useMemo(() => {
    return getlowHeaders(columnsWinhPinned);
  }, [columnsWinhPinned]);

  const resizersRefs = useRefs<HTMLDivElement>(lowHeaders.length);

  const headerHeight = useMemo(() => {
    return headerRowsHeights.reduce(reduceSum);
  }, [headerRowsHeights]);

  const stickyTopOffsets = useMemo(() => {
    return getStickyTopOffsets(flattenedHeaders, headerRowsHeights);
  }, [flattenedHeaders, headerRowsHeights, headerCellsHeights]);

  const resizerTopOffsets = useMemo(() => {
    return getResizerTopOffsets(flattenedHeaders, lowHeaders, stickyTopOffsets);
  }, [flattenedHeaders, lowHeaders, stickyTopOffsets]);

  const [stickyLeftOffsets, stickyRightOffsets] = useMemo(() => {
    const flattenedHeadersLowCellsKeys =
      getFlattenedHeadersLowCellsKeys(flattenedHeaders);

    return [
      getHeaderStickyLeftOffsets(flattenedHeadersLowCellsKeys, lowHeaders),
      getHeaderStickyRightOffsets(flattenedHeadersLowCellsKeys, lowHeaders),
    ];
  }, [flattenedHeaders, lowHeaders]);

  const bordersFlattenedHeaders: [boolean, boolean][] = useMemo(() => {
    return flattenedHeaders.map((flattenedHeadersCollum, index) => {
      let prevLowKey = '';
      const stopRef = { current: false };
      mapColums(
        [flattenedHeadersCollum],
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
        !flattenedHeadersCollum.position.isFirst &&
          !(
            flattenedHeadersCollum.pinned !== 'left' &&
            lowHeaders[lowIndex - 1]?.pinned === 'left'
          ),
        flattenedHeadersCollum.pinned === 'left' &&
          flattenedHeaders[index + 1]?.pinned !== 'left',
      ];
    });
  }, [flattenedHeaders, lowHeaders]);

  return {
    headers,
    flattenedHeaders,
    lowHeaders,
    headerRowsHeights,
    resizerTopOffsets,
    headerHeight,
    resizersRefs,
    stickyTopOffsets,
    stickyLeftOffsets,
    stickyRightOffsets,
    headerCellsRefs,
    bordersFlattenedHeaders,
  };
};
