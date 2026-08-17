import './Collapse.css';

import {
  computedSet,
  factoryComponent,
} from '@consta/uikit/__internal__/src/utils/state';
import { isString } from '@consta/uikit/__internal__/src/utils/type-guards';
import { animateTimeout } from '@consta/uikit/MixPopoverAnimate';
import { Text } from '@consta/uikit/Text';
import { Transition } from '@consta/uikit/Transition';
import { action, atom, reatomBoolean } from '@reatom/core';
import React from 'react';

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

export const Collapse = factoryComponent<HTMLDivElement, CollapseProps>(
  ({ expanded }, propsAtom) => {
    const contentElementAtom = atom<HTMLDivElement | null>(null);

    const expandedAtom = computedSet(() => !!propsAtom().expanded);
    const fullscreenAtom = computedSet(() => !!propsAtom().fullscreen);
    const fakeContentHeightAtom = atom<number | undefined>(undefined);
    const expandedContentMountedAtom = reatomBoolean(expanded);

    const toggleExpanded = action((e: React.MouseEvent<HTMLButtonElement>) => {
      const value = !expandedAtom();
      propsAtom().onExpand?.(value, e);
      expandedAtom.set(value);
      if (value) {
        expandedContentMountedAtom.setTrue();
      }
    });

    const toggleFullscreen = action(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        const value = !fullscreenAtom();
        propsAtom().onFullscreen?.(value, e);
        fullscreenAtom.set(value);

        fakeContentHeightAtom.set(
          value ? contentElementAtom()?.clientHeight : undefined,
        );
      },
    );

    return ({
      expandButton,
      expanded: expandedProp,
      onExpand,
      fullscreenButton,
      fullscreen: fullscreenProp,
      onFullscreen,
      leftSide,
      rightSide,
      className,
      children,
      fullscreenContainer = window.document.body,
      fullscreenZIndex = 1000,
      expandedMaxHeight = 'auto',
      ref,
      ...otherProps
    }) => {
      const expanded = expandedAtom();
      const expandedContentMounted = expandedContentMountedAtom();
      const fullscreen = fullscreenAtom();
      const fakeContentHeight = fakeContentHeightAtom();

      const title = isString(leftSide) ? (
        <Text className={cnCollapse('Title')} size="m" weight="semibold">
          {leftSide}
        </Text>
      ) : (
        leftSide
      );

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
                  timeout={animateTimeout}
                  onExited={expandedContentMountedAtom.setFalse}
                >
                  {() => (
                    <div
                      className={cnCollapse('ChildrenWrapper')}
                      ref={contentElementAtom.set}
                      style={{ maxHeight: expandedMaxHeight }}
                    >
                      {children}
                    </div>
                  )}
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
    };
  },
);
