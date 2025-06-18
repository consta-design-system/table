import { IconArrowDown } from '@consta/icons/IconArrowDown';
import { withAnimateSwitcherHOC } from '@consta/icons/withAnimateSwitcherHOC';

export const CollapseExpandIcon = withAnimateSwitcherHOC({
  startIcon: IconArrowDown,
  endDirection: 180,
});
