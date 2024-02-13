import './TableResizers.css';

import React from 'react';

import { cn } from '##/utils/bem';

import { TableColumn } from '../types';

type Props<T> = {
  lowHeaders: TableColumn<T>[];
  resizersRefs: React.RefObject<HTMLDivElement>[];
  handlers: {
    onMouseDown: React.MouseEventHandler<Element>;
    onTouchStart: React.TouchEventHandler<Element>;
  }[];
  resizable?: 'inside' | 'outside';
  activeIndex: number | null;
};

const cnTableResizers = cn('TableResizers');

export const TableResizers = <T,>(props: Props<T>) => {
  const { lowHeaders, resizersRefs, handlers, resizable, activeIndex } = props;

  return (
    <div className={cnTableResizers()}>
      {lowHeaders.map((column, index) => (
        <div
          className={cnTableResizers('Cell')}
          ref={resizersRefs[index]}
          key={index}
          style={{
            ['--table-resizer-top-offset' as string]: `var(--table-resizer-top-offset-${index})`,
          }}
        >
          {resizable &&
            (column.maxWidth === undefined ||
              column.maxWidth !== column.minWidth) &&
            !column.isSeparator &&
            !(resizable === 'inside' && lowHeaders.length === index + 1) && (
              <div
                {...handlers[index]}
                className={cnTableResizers('Resizer', {
                  active: activeIndex === index,
                })}
                aria-hidden
              />
            )}
        </div>
      ))}
    </div>
  );
};
