import './TextFieldCell.css';

import { setRefs } from '@consta/uikit/__internal__/src/utils/setRef';
import {
  clickOutsideEffect,
  factoryComponent,
  keysEffect,
} from '@consta/uikit/__internal__/src/utils/state';
import {
  TextField,
  TextFieldProps,
  TextFieldPropValue,
} from '@consta/uikit/TextFieldCanary';
import {
  action,
  atom,
  computed,
  effect,
  peek,
  reatomBoolean,
} from '@reatom/core';
import React from 'react';

import { DataCell } from '##/components/DataCell';
import { cn } from '##/utils/bem';

const cnTextFieldCell = cn('TextFieldCell');

export type TextFieldCellProps<TYPE extends string> = Omit<
  TextFieldProps<TYPE>,
  'view' | 'size' | 'form' | 'status'
> & {
  size?: 's' | 'm';
  lineClamp?: number;
  readModeRender?: (value?: TextFieldPropValue<TYPE>) => React.ReactNode;
  level?: number;
  truncate?: boolean;
  status?: 'alert' | 'warning';
  indicator?: 'alert' | 'warning';
  readonly?: boolean;
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

export const TextFieldCell = factoryComponent(
  (initProps: SplitProps, propsAtom) => {
    const rootElAtom = atom<HTMLDivElement | null>(null);
    const inputElAtom = atom<HTMLInputElement | null>(null);

    const inputRef = action((el: HTMLInputElement | null) =>
      setRefs([inputElAtom.set, propsAtom().inputRef], el),
    );

    const rootRef = action((el: HTMLDivElement | null) =>
      setRefs([rootElAtom.set, propsAtom().ref], el),
    );

    const editModeAtom = reatomBoolean(false);

    clickOutsideEffect({
      isActiveAtom: editModeAtom,
      ignoreClicksElementsAtom: computed(() => [rootElAtom()]),
      handler: editModeAtom.setFalse,
    });

    keysEffect({
      isActiveAtom: editModeAtom,
      elAtom: rootElAtom,
      keysAtom: computed(() => ({
        Escape: editModeAtom.setFalse,
      })),
    });

    effect(() => editModeAtom() && inputElAtom()?.focus());

    return (props) => {
      const {
        className,
        size = 'm',
        lineClamp,
        type,
        value,
        readModeRender = readModeRenderDefault,
        level,
        truncate,
        defaultValue,
        onChange,
        id,
        name,
        disabled,
        maxLength,
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
        status,
        indicator,
        readonly,
        ...restProps
      } = props;

      const textFiledProps = {
        className: cnTextFieldCell('Field'),
        view: 'clear',
        onDoubleClick: editModeAtom.setTrue,
        value,
        type,
        inputRef,
        defaultValue,
        onChange,
        id,
        name,
        disabled,
        maxLength,
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

      const editMode = editModeAtom();

      return (
        <DataCell
          {...restProps}
          className={cnTextFieldCell({ size }, [className])}
          ref={rootRef}
          onDoubleClick={readonly ? undefined : editModeAtom.setTrue}
          size={size}
          lineClamp={lineClamp}
          indicator={!editMode ? indicator : undefined}
          level={level}
          truncate={truncate}
          data-cell-edit-mode={editMode}
          data-cell-status={editMode ? status : undefined}
        >
          {editMode ? <TextField {...textFiledProps} /> : readModeRender(value)}
        </DataCell>
      );
    };
  },
) as TextFieldCellComponent;
