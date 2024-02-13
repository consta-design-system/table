import React from 'react';

export type UseResizableColmnsBlock = {
  ref: React.RefObject<HTMLElement>;
  maxWidth?: number;
  minWidth?: number;
  width?: number | string;
};

export type UseResizableColmnsProps = {
  blocks: Array<UseResizableColmnsBlock>;
  container: React.RefObject<HTMLElement>;
  resizable?: 'inside' | 'outside';
};

export type UseResizableColmnsSize = number | string | undefined;

export type UseResizableColmnsHook = (props: UseResizableColmnsProps) => {
  handlers: Array<{
    onMouseDown: React.MouseEventHandler;
    onTouchStart: React.TouchEventHandler;
  }>;
  sizes: UseResizableColmnsSize[];
  activeIndex: number | null;
};
