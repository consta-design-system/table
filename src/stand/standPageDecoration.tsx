import { Group, Lib } from '@consta/stand';
import React, { StrictMode } from 'react';

export const StandPageDecoration: Lib<Group>['standPageDecoration'] = (
  props,
) => {
  return <StrictMode>{props.children}</StrictMode>;
};
