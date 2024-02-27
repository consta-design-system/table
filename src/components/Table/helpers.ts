import { useRef } from 'react';

import { isNotNil, isNumber, isString } from '../../utils/type-guards';
import { TableColumn } from './types';

const columnDefaultWidth = 100;
// export const prepareWidth = <T>(
//   colums: TableColumn<T>[],
//   rowColums: TableColumn<T>[],
// ) => {
//   let groupWidth = 0;
//   let returnedArray: TableColumn<T>[] = [];

//   for (let index = 0; index < colums.length; index++) {
//     const element = colums[index];
//     let width = element.columns ? 0 : element.width || columnDefaultWidth;
//     groupWidth += width;
//     let columns;
//     if (element.columns) {
//       const [lowLevelWidth, lowLevelReturnedArray] = prepareWidth(
//         element.columns,
//         rowColums,
//       );

//       groupWidth += lowLevelWidth;
//       width += lowLevelWidth;
//       columns = lowLevelReturnedArray;
//     } else {
//       rowColums.push({ ...element, width });
//     }

//     // rowColums.push(...columns);

//     if (returnedArray.length) {
//       returnedArray.push({
//         ...element,
//         width,
//         ...(columns ? { columns } : {}),
//       });
//     } else {
//       returnedArray = [{ ...element, width, ...(columns ? { columns } : {}) }];
//     }
//   }

//   return [groupWidth, returnedArray] as const;
// };

// export const prepareColumns = <T>(colums: TableColumn<T>[]) => {
//   const rowColums: TableColumn<T>[] = [];
//   const columsWithWidth = prepareWidth(colums, rowColums);

//   return [columsWithWidth[1], rowColums] as const;
// };

export type Header<T> = TableColumn<T> & {
  position: Position;
  colId?: number;
  parentId?: number;
};

export type Position = {
  colSpan?: number;
  rowSpan?: number;
  level: number;
  gridIndex: number;
  isFirst?: boolean;
  topHeaderGridIndex: number;
  smallTextSize?: boolean;
  height?: number;
};

const getLastChildrenCount = <T>(columns: Array<TableColumn<T>>) => {
  let count = 0;

  const traverse = (cols: Array<TableColumn<T>>) => {
    cols.forEach((item: TableColumn<T>) => {
      if (item.columns) {
        traverse(item.columns);
      } else {
        count++;
      }
    });
  };

  traverse(columns);

  return count;
};

export const transformColumns = <T>(
  columns: Array<TableColumn<T>>,
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

      const handledItem: TableColumn<T> & {
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

      if (!handledItem.columns) {
        handledItem.position.rowSpan = maxLevel - level;
        headersArr[level].push(handledItem);
        node.index++;
      } else {
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

  console.log(headersArr);

  return headersArr;
};

export const getMaxLevel = <T>(columns: Array<TableColumn<T>>) => {
  let count = 0;

  const traverse = (cols: Array<TableColumn<T>>, level = 1) => {
    if (level > count) count = level;
    cols.forEach((item: TableColumn<T>) => {
      if (item.columns) {
        traverse(item.columns, level + 1);
      }
    });
  };

  traverse(columns);

  return count;
};

const getIsFirst = <T>(columns: Header<T>[], column: Header<T>): boolean => {
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
  headers: Array<Header<T>>[];
  flattenedHeaders: Array<Header<T>>;
  lowHeaders: Array<Header<T>>;
  headerRowsRefs: React.MutableRefObject<Record<number, HTMLDivElement | null>>;
  headerRowsHeights: Array<number>;
  headerColumnsHeights: Array<number>;
  resizerTopOffsets: Array<number>;
};

/**
 * Возвращает данные, необходимые для построения хидера таблицы
 *
 * @param columns - массив колонок
 *
 * @return {
 *   {Array<Header<T>>[]} headers: двумерный массив заголовков, выстроенный по вертикали;
 *   {Array<Header<T>>} flattenedHeaders: плоский массив заголовков;
 *   {Array<Header<T>>} lowHeaders: самые нижние заголовки (по ним строятся колонки);
 *   {Record<number, HTMLDivElement | null>} headerRowsRefs: содержит рефы на заголовки;
 *   {Array<number>} headerRowsHeights: массив высот строк заголовков;
 *   {Array<number>} headerColumnsHeights: массив высот колонок заголовков;
 *   {Array<number>} resizerTopOffsets: массив отступов для компонентов Resizer;
 * }
 */
export const useHeaderData = <T>(
  columns: Array<TableColumn<T>>,
): HeaderData<T> => {
  const headerRowsRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const headers = transformColumns(columns, getMaxLevel(columns));
  const headerColumnsHeights: Array<number> = Object.values(
    headerRowsRefs.current,
  )
    .filter(isNotNil)
    .map((ref) => ref.getBoundingClientRect().height);

  const flattenedHeaders = headers
    .flat()
    .filter((column: TableColumn<T>) => !column.hidden)
    .map((column, index, array) => ({
      ...column,
      position: {
        ...column.position,
        isFirst: getIsFirst(array, column),
        smallTextSize:
          headers.length > 1 && column.position.level === headers.length - 1,
        height: headerColumnsHeights[index] || 0,
      },
    }));
  const headerRowsHeights = headers.map((arr, index) => {
    return Math.min.apply(
      null,
      flattenedHeaders
        .filter(
          (col: TableColumn<T> & { position: Position }) =>
            col.position.level === index,
        )
        .map((item) => item.position.height),
    );
  });
  const lowHeaders = flattenedHeaders
    .filter(
      ({ position: { colSpan } }: TableColumn<T> & { position: Position }) =>
        !colSpan,
    )
    .sort((a, b) => {
      if (a.position.topHeaderGridIndex !== b.position.topHeaderGridIndex) {
        return a.position.topHeaderGridIndex > b.position.topHeaderGridIndex
          ? 1
          : -1;
      }
      return a.position.gridIndex > b.position.gridIndex ? 1 : -1;
    });

  const resizerTopOffsets = lowHeaders.map(
    (header: TableColumn<T> & { position: Position }, index: number) => {
      const headerHeight = headerRowsHeights.reduce(
        (a: number, b: number) => a + b,
        0,
      );
      if (
        (header.position.rowSpan || 0) >=
        (lowHeaders[index + 1]?.position.rowSpan || 0)
      ) {
        return headerHeight - (header.position.height || 0);
      }
      // eslint-disable-next-line no-unsafe-optional-chaining
      return headerHeight - lowHeaders[index + 1]?.position.height! || 0;
    },
  );

  console.log(headerRowsHeights);

  return {
    headers,
    flattenedHeaders,
    lowHeaders,
    headerRowsRefs,
    headerRowsHeights,
    headerColumnsHeights,
    resizerTopOffsets,
  };
};
