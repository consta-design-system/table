import React from 'react';

import { TableResizeEvent } from '../../types';

export type UseResizableColumnsBlock = {
  ref: React.RefObject<HTMLElement>;
  maxWidth?: number;
  minWidth?: number;
  width?: number | string;
  accessor?: string;
};

export type UseResizableColumnsProps = {
  blocks: Array<UseResizableColumnsBlock>;
  container: React.RefObject<HTMLElement>;
  resizable?: 'inside' | 'outside';
  onResize?: TableResizeEvent;
};

export type UseResizableColumnsSize = number | string | undefined;
