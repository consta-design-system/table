import { AtomLike } from '@reatom/core';

import { TableResizeEvent } from '../../types';

export type ResizableColumnsBlock = {
  element: HTMLElement | null;
  maxWidth?: number;
  minWidth?: number;
  width?: number | string;
  accessor?: string;
};

export type ResizableColumnsProps = [
  blocks: AtomLike<ResizableColumnsBlock[]>,
  container: AtomLike<HTMLDivElement | null>,
  resizable: AtomLike<'inside' | 'outside' | undefined>,
  onAfterResize: TableResizeEvent,
];

export type ResizableColumnsSize = number | string | undefined;
