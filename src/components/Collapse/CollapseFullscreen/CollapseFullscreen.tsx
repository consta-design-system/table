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
import React, { useMemo, useRef } from 'react';
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

  container?: HTMLElement | React.RefObject<HTMLElement>;
  zIndex?: number;
};

const cnCollapseFullscreen = cn('CollapseFullscreen');

export const CollapseFullscreen: React.FC<CollapseFullscreenProps> = ({
  active = false,
  container,
  zIndex,
  rightSide,
  onFullscreen,
  children,
  leftSide,
}) => {
  const portalRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const toolbarRef = useRef<HTMLDivElement>(null);
  const toolbarHeight = useAtom(
    useResizeObservedAtom(
      useMemo(() => [toolbarRef], [toolbarRef, active]),
      getElementHeight,
    ),
  )[0][0];

  return (
    <Transition
      in={active}
      unmountOnExit
      nodeRef={portalRef}
      timeout={animateTimeout}
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
          className={cnCollapseFullscreen({ container: !!container }, [
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
