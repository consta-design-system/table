import { TableColumn } from './types';

export const prepareColumns = <T>(colums: TableColumn<T>[]) => {
  for (let index = 0; index < colums.length; index++) {
    const element = colums[index];
    console.log(element);
  }
};
