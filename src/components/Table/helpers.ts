import { TableColumn } from './types';

const columnDefaultWidth = 100;

export const prepareWidth = <T>(
  colums: TableColumn<T>[],
  rowColums: TableColumn<T>[],
) => {
  let groupWidth = 0;
  let returnedArray: TableColumn<T>[] = [];

  for (let index = 0; index < colums.length; index++) {
    const element = colums[index];
    let width = element.columns ? 0 : element.width || columnDefaultWidth;
    groupWidth += width;
    let columns;
    if (element.columns) {
      const [lowLevelWidth, lowLevelReturnedArray] = prepareWidth(
        element.columns,
        rowColums,
      );

      groupWidth += lowLevelWidth;
      width += lowLevelWidth;
      columns = lowLevelReturnedArray;
    } else {
      rowColums.push({ ...element, width });
    }

    // rowColums.push(...columns);

    if (returnedArray.length) {
      returnedArray.push({
        ...element,
        width,
        ...(columns ? { columns } : {}),
      });
    } else {
      returnedArray = [{ ...element, width, ...(columns ? { columns } : {}) }];
    }
  }

  return [groupWidth, returnedArray] as const;
};

export const prepareColumns = <T>(colums: TableColumn<T>[]) => {
  const rowColums: TableColumn<T>[] = [];
  const columsWithWidth = prepareWidth(colums, rowColums);

  return [columsWithWidth[1], rowColums] as const;
};
