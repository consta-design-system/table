import { AnimateIconSwitcherProvider } from '@consta/icons/AnimateIconSwitcherProvider';
import { IconComponent } from '@consta/icons/Icon';
import { IconArrowDown } from '@consta/icons/IconArrowDown';
import { IconCollapse } from '@consta/icons/IconCollapse';
import { IconExpand } from '@consta/icons/IconExpand';
import { withAnimateSwitcherHOC } from '@consta/icons/withAnimateSwitcherHOC';
import { withCtx } from '@consta/uikit/__internal__/src/utils/state/withCtx';
import { isString } from '@consta/uikit/__internal__/src/utils/type-guards';
import { Button } from '@consta/uikit/Button';
import { Text } from '@consta/uikit/Text';
import { useMutableRef } from '@consta/uikit/useMutableRef';
import { useAction, useAtom, useUpdate } from '@reatom/npm-react';
import React, { forwardRef } from 'react';

import { Toolbar } from '##/components/Toolbar';
import { cn } from '##/utils/bem';

const cnCollapse = cn('Collapse');

export type CollapseProps = JSX.IntrinsicElements['div'] & {
  expandButton?: boolean;
  expanded?: boolean;
  onExpand?: (value: boolean, e: React.MouseEvent<HTMLButtonElement>) => void;
  fullscreenButton?: (
    value: boolean,
    e: React.MouseEvent<HTMLButtonElement>,
  ) => void;
  fullscreen?: boolean;
  onFullscreen?: React.MouseEventHandler<HTMLDivElement>;
  leftSide: React.ReactNode;
  rightSide?: React.ReactNode;
  border?: 'bottom' | 'all' | boolean;
};

const FullscreenIcon = withAnimateSwitcherHOC({
  startIcon: IconExpand,
  endIcon: IconCollapse,
});

const ExpandIcon = withAnimateSwitcherHOC({
  startIcon: IconArrowDown,
  endDirection: 180,
});

const CollapseButton: React.FC<{
  icon: IconComponent;
  active: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}> = ({ icon, active, onClick }) => (
  <AnimateIconSwitcherProvider active={active}>
    <Button
      onClick={onClick}
      size="s"
      iconLeft={icon}
      view="ghost"
      form="round"
    />
  </AnimateIconSwitcherProvider>
);

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
      ...otherProps
    } = props;

    const refs = useMutableRef([onExpand, onFullscreen]);

    const [expanded, setExpanded, expandedAtom] = useAtom(expandedProp);
    const [fullscreen, setFullscreen, fullscreenAtom] = useAtom(fullscreenProp);

    const toggleExpanded = useAction(
      (ctx, e: React.MouseEvent<HTMLButtonElement>) => {
        const value = !ctx.get(expandedAtom);
        expandedAtom(ctx, value);
        refs.current[0]?.(value, e);
      },
    );

    const toggleFullscreen = useAction((ctx) =>
      expandedAtom(ctx, !ctx.get(fullscreenAtom)),
    );

    useUpdate(expandedAtom, [expandedProp]);
    useUpdate(fullscreenAtom, [fullscreenProp]);

    return (
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
                icon={ExpandIcon}
                onClick={() => setExpanded(!expanded)}
              />
            ) : null,
            isString(leftSide) ? <Text>{leftSide}</Text> : leftSide,
          ]}
          rightSide={[
            rightSide,
            fullscreenButton ? (
              <CollapseButton
                active={fullscreen}
                icon={FullscreenIcon}
                onClick={() => setFullscreen(!fullscreen)}
              />
            ) : null,
          ]}
        />
        {children && expanded && (
          <div className={cnCollapse('Content')}>{children}</div>
        )}
      </div>
    );
  }),
);
