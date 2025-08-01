import './CollapseFullscreen.css';

import {
  animateTimeout,
  cnMixPopoverAnimate,
} from '@consta/uikit/MixPopoverAnimate';
import {
  PortalWithTheme,
  PortalWithThemeConsumer,
} from '@consta/uikit/PortalWithTheme';
import { useTheme } from '@consta/uikit/Theme';
import { getElementHeight } from '@consta/uikit/useResizeObserved';
import { useAtom } from '@reatom/npm-react';
import React, { useEffect, useMemo, useRef } from 'react';
import { Transition } from 'react-transition-group';

import { Toolbar } from '##/components/Toolbar';
import { useResizeObservedAtom } from '##/hooks/useResizeObservedAtom';
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

export const CollapseFullscreen: React.FC<CollapseFullscreenProps> = ({
  active = false,
  container,
  zIndex,
  rightSide,
  onFullscreen,
  children,
  leftSide,
}) => {
  const containerIsBody =
    container === window.document.body ||
    ('current' in container && container.current === window.document.body);

  const portalRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const toolbarRef = useRef<HTMLDivElement>(null);
  const toolbarHeight = useAtom(
    useResizeObservedAtom(
      useMemo(() => [toolbarRef], [toolbarRef, active]),
      getElementHeight,
    ),
  )[0][0];

  useEffect(() => {
    if (active && containerIsBody) {
      bodyAddStyles();
    }
  }, [active]);

  useEffect(() => {
    return bodyRemoveStyles;
  }, []);

  return (
    <Transition
      in={active}
      unmountOnExit
      nodeRef={portalRef}
      timeout={animateTimeout}
      onExited={bodyRemoveStyles}
    >
      {(animate) => (
        <PortalWithTheme
          ref={portalRef}
          preset={theme}
          container={container}
          style={{
            zIndex,
            [`--collapse-toolbar-height` as string]: `${toolbarHeight}px`,
          }}
          className={cnCollapseFullscreen({ container: !containerIsBody }, [
            cnMixPopoverAnimate({
              animate,
            }),
          ])}
        >
          <PortalWithThemeConsumer ignoreClicksInsideRefs={[portalRef]}>
            <div className={cnCollapseFullscreen('ToolbarWrapper')}>
              <Toolbar
                className={cnCollapseFullscreen('Toolbar')}
                ref={toolbarRef}
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
    </Transition>
  );
};
