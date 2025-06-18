import './Collapse.css';

import { useCreateAtom } from '@consta/uikit/__internal__/src/utils/state/useCreateAtom';
import { withCtx } from '@consta/uikit/__internal__/src/utils/state/withCtx';
import { isString } from '@consta/uikit/__internal__/src/utils/type-guards';
import { animateTimeout } from '@consta/uikit/MixPopoverAnimate';
import { Text } from '@consta/uikit/Text';
import { useMutableRef } from '@consta/uikit/useMutableRef';
import { getElementHeight } from '@consta/uikit/useResizeObserved';
import { useAction, useAtom, useUpdate } from '@reatom/npm-react';
import React, { forwardRef, useEffect, useMemo, useRef } from 'react';
import { Transition } from 'react-transition-group';

import { Toolbar } from '##/components/Toolbar';
import { useResizeObservedAtom } from '##/hooks/useResizeObservedAtom';
import { cn } from '##/utils/bem';

import { CollapseButton } from './CollapseButton';
import { CollapseExpandIcon } from './CollapseExpandIcon';
import { CollapseFullscreen } from './CollapseFullscreen';
import { CollapseFullscreenIcon } from './CollapseFullscreenIcon';

const cnCollapse = cn('Collapse');

export type CollapseProps = JSX.IntrinsicElements['div'] & {
  expandButton?: boolean;
  expanded?: boolean;
  expandedMaxHeight?: number | 'auto';
  onExpand?: (value: boolean, e: React.MouseEvent<HTMLButtonElement>) => void;
  fullscreenButton?: boolean;
  fullscreen?: boolean;
  onFullscreen?: (
    value: boolean,
    e: React.MouseEvent<HTMLButtonElement>,
  ) => void;
  leftSide: React.ReactNode;
  rightSide?: React.ReactNode;
  border?: 'bottom' | 'all' | boolean;
  afterExitFullscreen?: () => void;
  fullscreenContainer?: Element | React.RefObject<Element>;
  fullscreenZIndex?: number;
};

export const Collapse = withCtx(
  forwardRef<HTMLDivElement, CollapseProps>((props, ref) => {
    const {
      expandButton,
      expanded: expandedProp = false,
      onExpand,
      fullscreenButton,
      fullscreen: fullscreenProp = false,
      onFullscreen,
      leftSide,
      rightSide,
      className,
      children,
      border,
      afterExitFullscreen,
      fullscreenContainer,
      fullscreenZIndex = 1000,
      expandedMaxHeight = 'auto',
      ...otherProps
    } = props;

    const refs = useMutableRef([onExpand, onFullscreen]);

    const contentRef = useRef<HTMLDivElement>(null);

    const [expanded, setExpanded, expandedAtom] = useAtom(expandedProp);
    const [fullscreen, setFullscreen, fullscreenAtom] = useAtom(fullscreenProp);
    const [fakeContentHeight, setFakeContentHeight, fakeContentHeightAtom] =
      useAtom<number | undefined>(undefined);

    const toggleExpanded = useAction(
      (ctx, e: React.MouseEvent<HTMLButtonElement>) => {
        const value = !ctx.get(expandedAtom);
        refs.current[0]?.(value, e);
        expandedAtom(ctx, value);
      },
    );

    const toggleFullscreen = useAction(
      (ctx, e: React.MouseEvent<HTMLButtonElement>) => {
        const value = !ctx.get(fullscreenAtom);
        refs.current[1]?.(value, e);
        fullscreenAtom(ctx, !ctx.get(fullscreenAtom));

        if (value) {
          setFakeContentHeight(contentRef.current?.clientHeight);
        } else {
          setFakeContentHeight(undefined);
        }
      },
    );

    const title = isString(leftSide) ? <Text>{leftSide}</Text> : leftSide;

    useUpdate(expandedAtom, [expandedProp]);
    useUpdate(fullscreenAtom, [fullscreenProp]);

    return (
      <>
        <div
          {...otherProps}
          ref={ref}
          className={cnCollapse({ expanded, fullscreen }, [className])}
        >
          <Toolbar
            border={border}
            leftSide={[
              expandButton ? (
                <CollapseButton
                  active={expanded}
                  icon={CollapseExpandIcon}
                  onClick={toggleExpanded}
                />
              ) : null,
              title,
            ]}
            rightSide={[
              rightSide,
              fullscreenButton ? (
                <CollapseButton
                  active={fullscreen}
                  icon={CollapseFullscreenIcon}
                  onClick={toggleFullscreen}
                />
              ) : null,
            ]}
          />
          {children && (
            <div
              className={cnCollapse('Content', { expanded })}
              style={{
                height: fakeContentHeight,
              }}
            >
              <Transition
                in={expanded && !fullscreen}
                unmountOnExit
                nodeRef={contentRef}
                timeout={animateTimeout}
              >
                <div
                  className={cnCollapse('ChildrenWrapper')}
                  ref={contentRef}
                  style={{ maxHeight: expandedMaxHeight }}
                >
                  {children}
                </div>
              </Transition>
            </div>
          )}
        </div>
        {children && (
          <CollapseFullscreen
            active={fullscreen}
            afterExit={afterExitFullscreen}
            onFullscreen={toggleFullscreen}
            container={
              fullscreenContainer as
                | HTMLElement
                | React.RefObject<HTMLElement>
                | undefined
            }
            zIndex={fullscreenZIndex}
            leftSide={title}
            rightSide={rightSide}
          >
            {children}
          </CollapseFullscreen>
        )}
      </>
    );
  }),
);
