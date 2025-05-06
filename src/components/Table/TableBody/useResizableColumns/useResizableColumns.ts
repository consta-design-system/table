import { useCreateAtom } from '@consta/uikit/__internal__/src/utils/state/useCreateAtom';
import { useSendToAtom } from '@consta/uikit/__internal__/src/utils/state/useSendToAtom';
import { action } from '@reatom/core';
import { useAction, useUpdate } from '@reatom/npm-react';
import { useEffect } from 'react';

import {
  addResult,
  getCalculatedSizes,
  getRefsSizes,
  sizesEq,
  useResizeContainer,
} from './helpers';
import { UseResizableColumnsProps } from './types';

export const useResizableColumns = (props: UseResizableColumnsProps) => {
  const propsAtom = useSendToAtom(props);
  const blocksLengthAtom = useCreateAtom(
    (ctx) => ctx.get(propsAtom).blocks.length,
  );
  const blocksAtom = useCreateAtom((ctx) => ctx.spy(propsAtom).blocks);
  const resizableAtom = useCreateAtom((ctx) => ctx.spy(propsAtom).resizable);

  const containerAtom = useCreateAtom((ctx) => ctx.spy(propsAtom).container);

  const { blocks } = props;

  const sizesAtom = useCreateAtom(getRefsSizes(blocks));

  const activeIndexAtom = useCreateAtom<number | null>(null);
  const resizingAtom = useCreateAtom(
    (ctx) => typeof ctx.spy(activeIndexAtom) === 'number',
  );

  const setSizes = useAction(
    (ctx, newSizes: (string | number | undefined)[]) => {
      if (!sizesEq(newSizes, ctx.get(sizesAtom))) {
        sizesAtom(ctx, newSizes);
      }
    },
  );

  const controlListeners = useAction((_, type: 'add' | 'remove') => {
    const method = type === 'add' ? 'addEventListener' : 'removeEventListener';
    document[method]('mouseup', handleRelease);
    document[method]('touchend', handleRelease);
    document[method]('mousemove', handleTouchMove);
    document[method]('touchmove', handleTouchMove);
  });

  const handleRelease = useAction((ctx) => {
    activeIndexAtom(ctx, null);
    controlListeners('remove');
  });

  const handlePress = useAction((ctx, index: number) => {
    activeIndexAtom(ctx, index);
    controlListeners('add');
  });

  const handleTouchMove = useAction(
    (ctx, event: MouseEvent | TouchEvent | Event) => {
      const { container, blocks, resizable } = ctx.get(propsAtom);
      const activeIndex = ctx.get(activeIndexAtom);

      if (typeof activeIndex === 'number' && resizable) {
        const sizes = ctx.get(sizesAtom);

        setSizes(
          addResult(
            getCalculatedSizes(
              event,
              activeIndex,
              blocks,
              container,
              sizes,
              resizable,
            ),
            sizes,
          ),
        );
      }
    },
  );

  const handlersAtom = useCreateAtom((ctx) => {
    const length = ctx.spy(blocksLengthAtom);
    const resizable = ctx.spy(resizableAtom);
    if (!resizable) {
      return [];
    }

    return Array.from({ length }).map((_el, index) => ({
      onMouseDown: () => handlePress(index),
      onTouchStart: () => handlePress(index),
    }));
  });

  useResizeContainer(
    containerAtom,
    blocksAtom,
    resizableAtom,
    sizesAtom,
    setSizes,
  );

  useUpdate(
    (_, blocks) => {
      setSizes(getRefsSizes(blocks));
    },
    [blocksAtom, resizableAtom],
  );

  useUpdate(
    (_, resizable) => {
      !resizable && handleRelease();
    },
    [resizableAtom],
  );

  useEffect(() => {
    return handleRelease;
  }, []);

  return {
    handlersAtom,
    sizesAtom,
    activeIndexAtom,
    resizingAtom,
  };
};
