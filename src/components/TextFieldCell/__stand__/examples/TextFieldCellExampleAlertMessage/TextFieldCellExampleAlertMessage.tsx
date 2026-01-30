import { Example } from '@consta/stand';
import { Informer } from '@consta/uikit/Informer';
import {
  animateTimeout,
  cnMixPopoverAnimate,
} from '@consta/uikit/MixPopoverAnimate';
import { Popover } from '@consta/uikit/Popover';
import { useClickOutside } from '@consta/uikit/useClickOutside';
import { useFlag } from '@consta/uikit/useFlag';
import { useHover } from '@consta/uikit/useHover';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Transition } from 'react-transition-group';

import { Table, TableColumn, TableRenderCell } from '##/components/Table';
import { TextFieldCell } from '##/components/TextFieldCell';

type Row = {
  col: string;
  col2: string;
  textArray: string[];
};

const rows: Row[] = [
  {
    col: 'value1',
    textArray: Array.from({ length: 11 }, (_, i) => `элемент-${i + 1}`),
    col2: 'value2',
  },
];

const CellTypeTextArray: TableRenderCell<Row> = (row) => {
  const popoverRef = useRef<HTMLDivElement>(null);
  const cellRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [value, setValue] = useState<string[] | null>(row.row.textArray);
  const [open, setOpen] = useFlag();

  const onChangeValue = useCallback((value: string[] | null) => {
    setValue(value);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, []);

  const error = !!(value && value.length > 10);

  useEffect(() => setOpen.set(error), [error]);

  useHover({
    isActive: error,
    refs: [popoverRef, cellRef],
    onHover: setOpen.on,
    onBlur: setOpen.off,
    hoverDelay: 500,
    blurDelay: 300,
  });

  useClickOutside({
    isActive: open,
    handler: setOpen.off,
    ignoreClicksInsideRefs: [popoverRef, cellRef],
  });

  return (
    <>
      <TextFieldCell
        type="textarray"
        value={value}
        clearButton
        onChange={onChangeValue}
        readModeRender={(value) => value?.join(', ')}
        size="m"
        status={error ? 'alert' : undefined}
        indicator={error ? 'alert' : undefined}
        ref={cellRef}
        inputRef={inputRef}
      />

      <Transition
        in={open}
        unmountOnExit
        timeout={animateTimeout}
        nodeRef={popoverRef}
      >
        {(animate) => {
          return (
            <Popover
              style={{ width: 200, zIndex: 100 }}
              className={cnMixPopoverAnimate({ animate })}
              offset="2xs"
              anchorRef={cellRef}
              ref={popoverRef}
              direction="rightStartUp"
              possibleDirections={[
                'rightStartUp',
                'rightStartDown',
                'downStartRight',
                'upStartRight',
              ]}
              spareDirection="downStartRight"
            >
              <Informer
                status="alert"
                view="bordered"
                label="Количество не должно превышать 10 значений"
              />
            </Popover>
          );
        }}
      </Transition>
    </>
  );
};

const columns: TableColumn<Row>[] = [
  {
    title: 'Колонка',
    accessor: 'col',
    minWidth: 150,
  },
  {
    title: 'Редактируемый массив',
    accessor: 'textArray',
    renderCell: CellTypeTextArray,
    minWidth: 200,
  },
  {
    title: 'Колонка',
    accessor: 'col2',
    minWidth: 150,
  },
];

export const TextFieldCellExampleAlertMessage = () => (
  <Example col={1}>
    <Table rows={rows} columns={columns} />
  </Example>
);
