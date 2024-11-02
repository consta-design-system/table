import { MixFlexPropJustify } from '@consta/uikit/MixFlex';

export const cellJustifyMap: Record<
  'left' | 'right' | 'center' | 'space-between',
  MixFlexPropJustify
> = {
  'center': 'center',
  'left': 'flex-start',
  'right': 'flex-end',
  'space-between': 'space-between',
};
