import './TextFieldCell.css';

import { useClickOutside } from '@consta/uikit/__internal__/src/hooks/useClickOutside';
import {
  TextField,
  TextFieldProps,
  TextFieldPropValue,
} from '@consta/uikit/TextFieldCanary';
import { useFlag } from '@consta/uikit/useFlag';
import { useForkRef } from '@consta/uikit/useForkRef';
import { useKeysRef } from '@consta/uikit/useKeysRef';
import React, { forwardRef, useEffect, useRef } from 'react';

import { DataCell } from '##/components/DataCell';
import { cn } from '##/utils/bem';

const cnTextFieldCell = cn('TextFieldCell');

// readonly вид, не понятно какую ячейку можно редактировать а какую нет
// у textarea вертикальные отступы отличаются от input и Text, по этому происходят прыжки текста при смене режима "просмотр/редактирование"
// также у textarea меняется межстрочный интервал в зависимсоти от размера(возможно только в коде)
// замечены проблемы в textarea resize=auto, появляется полоска скролла, а она не нужна
// в textarea resize=auto сделать возможным менять высоту контейнера вручную, при этом будет отключен авто режим
// всегда ли поведение двойного нужно для компонента? или дать переключение режимов на откуп пользователям?

export type TextFieldCellProps<TYPE extends string> = Omit<
  TextFieldProps<TYPE>,
  'view' | 'size' | 'form' | 'status'
> & {
  size?: 's' | 'm';
  lineClamp?: number;
  readModeRender?: (value?: TextFieldPropValue<TYPE>) => React.ReactNode;
  level?: number;
  indicator?: 'alert' | 'warning';
  truncate?: boolean;
};

type SplitProps = TextFieldCellProps<'textarea'> &
  TextFieldCellProps<'text'> &
  TextFieldCellProps<'textarray'> &
  TextFieldCellProps<'password'> &
  TextFieldCellProps<'number'>;

const readModeRenderDefault = <TYPE extends string>(
  value?: TextFieldPropValue<TYPE>,
) => value;

export type TextFieldCellComponent = <TYPE extends string>(
  props: TextFieldCellProps<TYPE>,
) => React.ReactNode | null;

const TextFieldCellRender = (
  props: SplitProps,
  ref: React.Ref<HTMLDivElement>,
) => {
  const {
    className,
    size = 'm',
    lineClamp,
    type,
    value,
    readModeRender = readModeRenderDefault,
    indicator,
    level,
    truncate,
    defaultValue,
    onChange,
    id,
    name,
    disabled,
    maxLength,
    minLength,
    onFocus,
    onBlur,
    placeholder,
    leftSide,
    rightSide,
    clearButton,
    iconClear,
    autoComplete,
    readOnly,
    tabIndex,
    ariaLabel,
    iconSize,
    onClear,
    inputRef: inputRefProp,
    onKeyUp,
    onKeyUpCapture,
    onKeyDown,
    onKeyDownCapture,
    onCopy,
    onCopyCapture,
    onCut,
    onCutCapture,
    onPaste,
    onPasteCapture,
    onWheel,
    max,
    min,
    step,
    incrementButtons,
    iconShowPassword,
    iconHidePassword,
    resize,
    minRows,
    maxRows,
    rows,
    renderValueItem,
    inputValue,
    onInputChange,
    ...restProps
  } = props;
  const refRoot = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const inputRefForked = useForkRef([inputRef, inputRefProp]);

  const [editMode, setEditMode] = useFlag(false);

  useClickOutside({
    isActive: editMode,
    ignoreClicksInsideRefs: [refRoot],
    handler: setEditMode.off,
  });

  useKeysRef({
    isActive: editMode,
    ref: refRoot,
    keys: {
      Escape: setEditMode.off,
    },
  });

  useEffect(() => {
    if (editMode) {
      inputRef.current?.focus();
    }
  }, [editMode]);

  const textFiledProps = {
    className: cnTextFieldCell('Field'),
    view: 'clear',
    onDoubleClick: setEditMode.on,
    value,
    type,
    inputRef: inputRefForked,
    defaultValue,
    onChange,
    id,
    name,
    disabled,
    maxLength,
    minLength,
    onFocus,
    onBlur,
    placeholder,
    leftSide,
    rightSide,
    clearButton,
    iconClear,
    autoComplete,
    readOnly,
    tabIndex,
    ariaLabel,
    iconSize,
    onClear,
    onKeyUp,
    onKeyUpCapture,
    onKeyDown,
    onKeyDownCapture,
    max,
    min,
    step,
    incrementButtons,
    iconShowPassword,
    iconHidePassword,
    resize,
    minRows,
    maxRows,
    rows,
    renderValueItem,
    inputValue,
    onInputChange,
    onCopy,
    onCopyCapture,
    onCut,
    onCutCapture,
    onPaste,
    onPasteCapture,
    onWheel,
    size,
  } as const;

  //

  return (
    <DataCell
      {...restProps}
      className={cnTextFieldCell({ size }, [className])}
      ref={useForkRef([refRoot, ref])}
      onDoubleClick={setEditMode.on}
      size={size}
      lineClamp={lineClamp}
      indicator={indicator}
      level={level}
      truncate={truncate}
      data-cell-edit-mode={editMode}
    >
      {editMode ? <TextField {...textFiledProps} /> : readModeRender(value)}
    </DataCell>
  );
};

export const TextFieldCell = forwardRef(
  TextFieldCellRender,
) as TextFieldCellComponent;
