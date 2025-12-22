import './TextFieldCell.css';

import { useClickOutside } from '@consta/uikit/__internal__/src/hooks/useClickOutside';
import { cnMixFlex } from '@consta/uikit/MixFlex';
import { cnMixSpace } from '@consta/uikit/MixSpace';
import { Text } from '@consta/uikit/Text';
import {
  TextField,
  TextFieldProps,
  TextFieldPropValue,
} from '@consta/uikit/TextFieldCanary';
import { useFlag } from '@consta/uikit/useFlag';
import { useForkRef } from '@consta/uikit/useForkRef';
import React, { forwardRef, useEffect, useRef } from 'react';

import { DataCell } from '##/components/DataCell';
import { cn } from '##/utils/bem';

const cnTextFieldCell = cn('TextFieldCell');

export type TextFieldCellProps<TYPE extends string> = TextFieldProps<TYPE> & {
  size?: 's' | 'm';
  lineClamp?: number;
  readModeRender?: (value?: TextFieldPropValue<TYPE>) => React.ReactNode;
};

const readModeRenderDefault = <TYPE extends string>(
  value?: TextFieldPropValue<TYPE>,
) => value;

export type TextFieldCellComponent = <TYPE extends string>(
  props: TextFieldCellProps<TYPE>,
) => React.ReactNode | null;

const TextFieldCellRender = <TYPE extends string>(
  props: TextFieldCellProps<TYPE>,
  refRoot: React.Ref<HTMLDivElement>,
) => {
  const {
    size = 'm',
    lineClamp,
    type,
    value,
    readModeRender = readModeRenderDefault,
    ...restProps
  } = props;
  const [editMode, setEditMode] = useFlag(false);
  const refTextField = useRef<HTMLDivElement>(null);
  const ref = useForkRef([refTextField, refRoot]);
  const inputRef = useRef<HTMLInputElement>(null);

  useClickOutside({
    isActive: editMode,
    ignoreClicksInsideRefs: [refTextField],
    handler: setEditMode.off,
  });

  // useEffect(() => {
  //   if (editMode) {
  //     inputRef.current?.focus();
  //   }
  // }, [editMode]);

  // добавить переключение режима по esc

  return (
    <DataCell
      className={cnTextFieldCell({ editMode })}
      ref={ref}
      onDoubleClick={setEditMode.on}
      size={size}
      lineClamp={lineClamp}
    >
      {editMode ? (
        <TextField
          {...restProps}
          className={cnTextFieldCell('Field', { size })}
          data-cell-edit-mode="true"
          view="clear"
          onDoubleClick={setEditMode.on}
          value={value}
          size={size}
          type={type}
          inputRef={inputRef}
        />
      ) : (
        readModeRender(value)
      )}
    </DataCell>
  );
};

export const TextFieldCell = forwardRef(
  TextFieldCellRender,
) as TextFieldCellComponent;
