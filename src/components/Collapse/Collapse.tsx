import './Collapse.css';

import { withCtx } from '@consta/uikit/__internal__/src/utils/state/withCtx';
import { isString } from '@consta/uikit/__internal__/src/utils/type-guards';
import { animateTimeout } from '@consta/uikit/MixPopoverAnimate';
import { Text } from '@consta/uikit/Text';
import { useMutableRef } from '@consta/uikit/useMutableRef';
import { useAction, useAtom, useUpdate } from '@reatom/npm-react';
import React, { forwardRef, useRef } from 'react';
import { Transition } from 'react-transition-group';

import { Toolbar } from '##/components/Toolbar';
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
  fullscreenContainer?: Element | React.RefObject<HTMLElement>;
  fullscreenZIndex?: number;
};

/**
 * Props for the Collapse component.
 *
 * @extends JSX.IntrinsicElements['div']
 * @property {boolean} [expandButton] - показывает кнопку раскрытия..
 * @property {boolean} [expanded=false] - указывает, раскрыт ли компонент.
 * @property {number | 'auto'} [expandedMaxHeight='auto'] - максимальная высота при раскрытии..
 * @property {(value: boolean, e: React.MouseEvent<HTMLButtonElement>) => void} [onExpand] - обработчик изменения состояния раскрытия.
 * @property {boolean} [fullscreenButton] - показывает кнопку полноэкранного режима.
 * @property {boolean} [fullscreen=false] - указывает, находится ли компонент в полноэкранном режиме.
 * @property {(value: boolean, e: React.MouseEvent<HTMLButtonElement>) => void} [onFullscreen] - обработчик изменения полноэкранного режима.
 * @property {React.ReactNode} leftSide - контент для отображения на левой стороне.
 * @property {React.ReactNode} [rightSide] - контент для отображения на правой стороне.
 * @property {Element | React.RefObject<HTMLElement>} [fullscreenContainer=`window.document.body`] -  контейнер для полноэкранного режима.
 * @property {number} [fullscreenZIndex=1000] - уровень z-index для полноэкранного режима.
 * @property {string} [className] - дополнительный класс.
 * @property {React.ReactNode} children - контент для отображения внутри компонента.
 */

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
      fullscreenContainer = window.document.body,
      fullscreenZIndex = 1000,
      expandedMaxHeight = 'auto',
      ...otherProps
    } = props;

    const refs = useMutableRef([onExpand, onFullscreen]);

    const contentRef = useRef<HTMLDivElement>(null);

    const [expanded, , expandedAtom] = useAtom(expandedProp);
    const [fullscreen, , fullscreenAtom] = useAtom(fullscreenProp);
    const [fakeContentHeight, setFakeContentHeight] = useAtom<
      number | undefined
    >(undefined);
    const [expandedContentMounted, , expandedContentMountedAtom] =
      useAtom(expanded);

    const toggleExpanded = useAction(
      (ctx, e: React.MouseEvent<HTMLButtonElement>) => {
        const value = !ctx.get(expandedAtom);
        refs.current[0]?.(value, e);
        expandedAtom(ctx, value);
        if (value) {
          expandedContentMountedAtom(ctx, true);
        }
      },
    );

    const toggleFullscreen = useAction(
      (ctx, e: React.MouseEvent<HTMLButtonElement>) => {
        const value = !ctx.get(fullscreenAtom);
        refs.current[1]?.(value, e);
        fullscreenAtom(ctx, value);

        setFakeContentHeight(
          value ? contentRef.current?.clientHeight : undefined,
        );
      },
    );

    const afterExitExpanded = useAction((ctx) => {
      expandedContentMountedAtom(ctx, false);
    });

    const title = isString(leftSide) ? (
      <Text className={cnCollapse('Title')} size="m" weight="semibold">
        {leftSide}
      </Text>
    ) : (
      leftSide
    );

    useUpdate(expandedAtom, [expandedProp]);
    useUpdate(fullscreenAtom, [fullscreenProp]);

    return (
      <>
        <div {...otherProps} ref={ref} className={className}>
          <Toolbar
            className={cnCollapse('Toolbar')}
            form="brick"
            border={expandedContentMounted ? 'bottom' : undefined}
            leftSide={[
              expandButton ? (
                <CollapseButton
                  active={expanded}
                  icon={CollapseExpandIcon}
                  onClick={toggleExpanded}
                />
              ) : null,
              ...(Array.isArray(title) ? title : [title]),
            ]}
            rightSide={[
              ...(Array.isArray(rightSide) ? rightSide : [rightSide]),
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
                onExited={afterExitExpanded}
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
            onFullscreen={toggleFullscreen}
            container={fullscreenContainer}
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
