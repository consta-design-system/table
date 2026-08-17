import './CollapseFullscreen.css';

import {
  factoryComponent,
  resizeObservedAtom,
} from '@consta/uikit/__internal__/src/utils/state';
import {
  animateTimeout,
  cnMixPopoverAnimate,
} from '@consta/uikit/MixPopoverAnimate';
import {
  PortalWithTheme,
  PortalWithThemeConsumer,
} from '@consta/uikit/PortalWithTheme';
import { ThemeContext } from '@consta/uikit/Theme';
import { Transition } from '@consta/uikit/Transition';
import { getElementHeight } from '@consta/uikit/useResizeObserved';
import { abortVar, atom, computed, effect, peek } from '@reatom/core';
import React from 'react';

import { Toolbar } from '##/components/Toolbar';
import { cn } from '##/utils/bem';

import { CollapseButton } from '../CollapseButton';
import { CollapseFullscreenIcon } from '../CollapseFullscreenIcon';

type CollapseFullscreenProps = JSX.IntrinsicElements['div'] & {
  active?: boolean;
  onFullscreen?: React.MouseEventHandler<HTMLButtonElement>;
  leftSide: React.ReactNode;
  rightSide?: React.ReactNode;

  container: Element | React.RefObject<HTMLElement>;
  zIndex?: number;
};

const cnCollapseFullscreen = cn('CollapseFullscreen');

const isClassName = (element: HTMLElement, className: string) => {
  return element.classList.contains(className);
};

const addClassName = (element: HTMLElement, className: string) => {
  if (!isClassName(element, className)) {
    element.classList.add(className);
  }
};

const removeClassName = (element: HTMLElement, className: string) => {
  if (isClassName(element, className)) {
    element.classList.remove(className);
  }
};

const addCssVariable = (variableName: string, value: string) => {
  document.documentElement.style.setProperty(variableName, value);
};

const removeCssVariable = (variableName: string) => {
  document.documentElement.style.removeProperty(variableName);
};

const getScrollBarWidth = () =>
  window.innerWidth - document.documentElement.clientWidth;

const bodyAddStyles = () => {
  const scrollBarWidth = getScrollBarWidth();

  addCssVariable(
    '--ct-collapse-fullscreen-body-scrollbar-width',
    `${scrollBarWidth}px`,
  );

  addClassName(window.document.documentElement, cnCollapseFullscreen('Body'));
};

const bodyRemoveStyles = () => {
  removeClassName(
    window.document.documentElement,
    cnCollapseFullscreen('Body'),
  );

  removeCssVariable('--ct-collapse-fullscreen-body-scrollbar-width');
};

export const CollapseFullscreen: React.FC<CollapseFullscreenProps> =
  factoryComponent((_, propsAtom) => {
    const containerIsBodyAtom = computed(() => {
      const { container } = propsAtom();
      return (
        container === window.document.body ||
        ('current' in container && container.current === window.document.body)
      );
    });

    const portalElement = atom<HTMLDivElement | null>(null);
    const portalRefAtom = computed(() => ({ current: portalElement() }));
    const toolbarElementAtom = atom<HTMLDivElement | null>(null);
    const activeAtom = computed(() => !!propsAtom().active);

    const toolbarHeightAtom = resizeObservedAtom(
      toolbarElementAtom,
      getElementHeight,
    );

    effect(() => {
      if (activeAtom() && peek(containerIsBodyAtom)) {
        bodyAddStyles();
      }
    });

    abortVar.subscribe(bodyRemoveStyles);

    return ({
      active = false,
      container,
      zIndex,
      rightSide,
      onFullscreen,
      children,
      leftSide,
    }) => {
      const portalRef = portalRefAtom();
      const containerIsBody = containerIsBodyAtom();

      return (
        <Transition
          in={active}
          unmountOnExit
          timeout={animateTimeout}
          onExited={bodyRemoveStyles}
        >
          {(animate) => (
            <ThemeContext.Consumer>
              {({ theme }) => (
                <PortalWithTheme
                  ref={portalRef}
                  preset={theme}
                  container={container}
                  style={{
                    zIndex,
                    [`--collapse-toolbar-height` as string]: `${toolbarHeightAtom()}px`,
                  }}
                  className={cnCollapseFullscreen(
                    { container: !containerIsBody },
                    [
                      cnMixPopoverAnimate({
                        animate,
                      }),
                    ],
                  )}
                >
                  <PortalWithThemeConsumer ignoreClicksInsideRefs={[portalRef]}>
                    <div className={cnCollapseFullscreen('ToolbarWrapper')}>
                      <Toolbar
                        className={cnCollapseFullscreen('Toolbar')}
                        ref={toolbarElementAtom.set}
                        leftSide={leftSide}
                        form="brick"
                        border="bottom"
                        rightSide={[
                          rightSide,
                          <CollapseButton
                            active={active}
                            icon={CollapseFullscreenIcon}
                            onClick={onFullscreen}
                          />,
                        ]}
                      />
                    </div>

                    <div className={cnCollapseFullscreen('ChildrenWrapper')}>
                      {children}
                    </div>
                  </PortalWithThemeConsumer>
                </PortalWithTheme>
              )}
            </ThemeContext.Consumer>
          )}
        </Transition>
      );
    };
  });
