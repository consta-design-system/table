import './TableData.css';

import React, { forwardRef } from 'react';

import { cn } from '##/utils/bem';
import { setRef } from '##/utils/setRef';
import { isNumber, isString } from '##/utils/type-guards';

import { TableDataComponent, TableDataProps } from '../types';

export const cnTableData = cn('TableData');

const getCellDataByAccessor = <T,>(
  row: T,
  accessor?: (keyof T extends string ? string & keyof T : never) | undefined,
): string => {
  if (!accessor) {
    return '';
  }
  const data = row?.[accessor];

  if (isString(data) || isNumber(data)) {
    return data.toString();
  }

  return '';
};

const TableDataRender = <T,>(
  props: TableDataProps<T>,
  ref: React.Ref<HTMLDivElement>,
) => {
  const {
    className,
    rows,
    lowHeaders,
    rowsRefs,
    slice,
    setBoundaryRef,
    headerColumnsHeights,
    ...otherProps
  } = props;

  console.log(lowHeaders);

  return (
    <div {...otherProps} ref={ref} className={cnTableData(null, [className])}>
      {rows.slice(...slice).map((row, rowIndex) => {
        const rowkey = rowIndex + slice[0];
        return (
          <div className={cnTableData('Row')} key={rowkey}>
            {lowHeaders.map((column, columnIndex) => {
              return (
                <div
                  key={columnIndex}
                  ref={columnIndex === 0 ? rowsRefs[rowkey] : undefined}
                >
                  {getCellDataByAccessor(row, column.accessor)}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export const TableData = forwardRef(TableDataRender) as TableDataComponent;
