import { IconCollapse } from '@consta/icons/IconCollapse';
import { IconExpand } from '@consta/icons/IconExpand';
import { withAnimateSwitcherHOC } from '@consta/icons/withAnimateSwitcherHOC';

export const CollapseFullscreenIcon = withAnimateSwitcherHOC({
  startIcon: IconExpand,
  endIcon: IconCollapse,
});
