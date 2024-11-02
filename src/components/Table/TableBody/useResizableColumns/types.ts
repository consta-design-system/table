import React from 'react';

export type UseResizableColumnsBlock = {
  ref: React.RefObject<HTMLElement>;
  maxWidth?: number;
  minWidth?: number;
  width?: number | string;
};

export type UseResizableColumnsProps = {
  blocks: Array<UseResizableColumnsBlock>;
  container: React.RefObject<HTMLElement>;
  resizable?: 'inside' | 'outside';
};

export type UseResizableColumnsSize = number | string | undefined;

export type UseResizableColumnsHook = (props: UseResizableColumnsProps) => {
  handlers: Array<{
    onMouseDown: React.MouseEventHandler;
    onTouchStart: React.TouchEventHandler;
  }>;
  sizes: UseResizableColumnsSize[];
  activeIndex: number | null;
};
