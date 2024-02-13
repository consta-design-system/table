import { useMutableRef } from '@consta/uikit/useMutableRef';
import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  addResult,
  getCalcaulatedSizes,
  getRefsSizes,
  sizesEq,
  useResizeContainer,
} from './helpers';
import { UseResizableColmnsHook } from './types';

export const useResizableColmns: UseResizableColmnsHook = (props) => {
  const { blocks, container, resizable } = props;

  const [sizes, setSizes] = useState(getRefsSizes(blocks));

  const setSizesWithCompare = useCallback(
    (newSizes: (string | number | undefined)[]) => {
      setSizes((sizes) => (sizesEq(newSizes, sizes) ? sizes : newSizes));
    },
    [],
  );

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const refs = useMutableRef([
    container,
    blocks,
    resizable,
    activeIndex,
    sizes,
  ] as const);

  const handleRelease = useCallback(() => {
    controlListeners('remove');
    setActiveIndex(null);
  }, []);

  const handleTouchMove = useCallback(
    (event: MouseEvent | TouchEvent | Event) => {
      const [container, blocks, resizable, activeIndex] = refs.current;
      if (typeof activeIndex === 'number' && resizable) {
        setSizes((sizes) => {
          const calculatedSizes = getCalcaulatedSizes(
            event,
            activeIndex,
            blocks,
            container,
            sizes,
            resizable,
          );

          const newSizes = addResult(calculatedSizes, sizes);

          if (sizesEq(newSizes, sizes)) {
            return sizes;
          }

          return newSizes;
        });
      }
    },
    [],
  );

  const controlListeners = useCallback((type: 'add' | 'remove') => {
    const method = type === 'add' ? 'addEventListener' : 'removeEventListener';
    document[method]('mouseup', handleRelease);
    document[method]('touchend', handleRelease);
    document[method]('mousemove', handleTouchMove);
    document[method]('touchmove', handleTouchMove);
  }, []);

  const handlePress = useCallback((index: number) => {
    setActiveIndex(index);
    controlListeners('add');
  }, []);

  const handlers = useMemo(
    () =>
      Array.from({ length: blocks.length }).map((_el, index) => ({
        onMouseDown: () => (resizable ? handlePress(index) : undefined),
        onTouchStart: () => (resizable ? handlePress(index) : undefined),
      })),
    [blocks, container, resizable],
  );

  useResizeContainer(container, refs, setSizesWithCompare);

  useEffect(() => {
    setSizesWithCompare(getRefsSizes(blocks));
  }, [blocks, resizable]);

  useEffect(() => {
    !resizable && handleRelease();
  }, [resizable]);

  return {
    handlers,
    sizes,
    activeIndex,
  };
};
