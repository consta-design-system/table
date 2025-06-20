import './CollapseFullscreen.css';

import { isNumber } from '@consta/uikit/__internal__/src/utils/type-guards';
import {
  animateTimeout,
  cnMixPopoverAnimate,
} from '@consta/uikit/MixPopoverAnimate';
import {
  PortalWithTheme,
  usePortalContext,
} from '@consta/uikit/PortalWithTheme';
import { useTheme } from '@consta/uikit/Theme';
import { useClickOutside } from '@consta/uikit/useClickOutside';
import { getElementHeight } from '@consta/uikit/useResizeObserved';
import { useAction, useAtom, useUpdate } from '@reatom/npm-react';
import React, { forwardRef, useMemo, useRef } from 'react';
import { Transition } from 'react-transition-group';

import { Toolbar } from '##/components/Toolbar';
import { useResizeObservedAtom } from '##/hooks/useResizeObservedAtom';
import { cn } from '##/utils/bem';

import { CollapseButton } from '../CollapseButton';
import { CollapseFullscreenIcon } from '../CollapseFullscreenIcon';
/**
 * Подписчик на PortalWithThemeProvider
 * получает рефы всех вложенных порталов во всплывающем окне
 * для дальнейшего исключения их из useClickOutside
 */
const ContextConsumer: React.FC<{
  onClickOutside?: (event: MouseEvent) => void;
  ignoreClicksInsideRefs?: ReadonlyArray<React.RefObject<HTMLElement>>;
  children: React.ReactNode;
}> = ({ onClickOutside, children, ignoreClicksInsideRefs }) => {
  const { refs } = usePortalContext();

  useClickOutside({
    isActive: !!onClickOutside,
    ignoreClicksInsideRefs: [
      ...(ignoreClicksInsideRefs || []),
      ...(refs || []),
    ],
    handler: onClickOutside,
  });

  return children as React.ReactNode;
};

type CollapseFullscreenProps = JSX.IntrinsicElements['div'] & {
  active?: boolean;
  onFullscreen?: React.MouseEventHandler<HTMLButtonElement>;
  leftSide: React.ReactNode;
  rightSide?: React.ReactNode;
  afterExit?: () => void;
  container?: Element;
  zIndex?: number;
};

const cnCollapseFullscreen = cn('CollapseFullscreen');

export const CollapseFullscreen: React.FC<CollapseFullscreenProps> = ({
  active = false,
  afterExit,
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

  console.log(toolbarRef.current);

  return (
    <Transition
      in={active}
      unmountOnExit
      nodeRef={portalRef}
      timeout={animateTimeout}
      onExited={afterExit}
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
          className={cnCollapseFullscreen(null, [
            cnMixPopoverAnimate({
              animate,
            }),
          ])}
        >
          <ContextConsumer ignoreClicksInsideRefs={[portalRef]}>
            <div className={cnCollapseFullscreen('ToolbarWrapper')}>
              <Toolbar
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
          </ContextConsumer>
        </PortalWithTheme>
      )}
    </Transition>
  );
};
