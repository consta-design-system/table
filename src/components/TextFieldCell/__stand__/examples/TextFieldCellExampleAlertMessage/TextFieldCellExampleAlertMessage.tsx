import { Example } from '@consta/stand';
import { Informer } from '@consta/uikit/Informer';
import {
  animateTimeout,
  cnMixPopoverAnimate,
} from '@consta/uikit/MixPopoverAnimate';
import { Popover } from '@consta/uikit/Popover';
import { useClickOutside } from '@consta/uikit/useClickOutside';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Transition } from 'react-transition-group';

import { Table, TableColumn, TableRenderCell } from '##/components/Table';
import { TextFieldCell } from '##/components/TextFieldCell';
import { useHoverWithDelay } from '##/hooks/useHoverWithDelay';

type Row = {
  col: string;
  col2: string;
  textArray: string[];
};

const rows: Row[] = [
  {
    col: 'value1',
    textArray: ['value5', 'value6'],
    col2: 'value2',
  },
];

const CellTypeTextArray: TableRenderCell<Row> = (row) => {
  const [value, setValue] = useState<string[] | null>(row.row.textArray);
  const [open, setOpen] = useState(false);

  const [inputValue, setInputValue] = useState<string | null>(null);
  const onChangeValueArray = useCallback((value: string[] | null) => {
    setValue(value);
    setInputValue(null);
  }, []);

  const error = !!(value && value.length > 10);
  const popoverRef = useRef<HTMLDivElement>(null);
  const cellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (error) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [error]);

  // useClickOutside({
  //   isActive: open,
  //   handler: () => setOpen(false),
  //   ignoreClicksInsideRefs: [popoverRef, cellRef],
  // });

  useHoverWithDelay({
    isActive: true,
    refs: [popoverRef, cellRef],
    onHover: () => setOpen(true),
    onBlur: () => setOpen(false),
    delay: 1000,
  });

  return (
    <>
      <TextFieldCell
        type="textarray"
        value={value}
        clearButton
        onChange={onChangeValueArray}
        inputValue={inputValue}
        onInputChange={setInputValue}
        readModeRender={(value) => value?.join(', ')}
        size="m"
        status={error ? 'alert' : undefined}
        indicator={error ? 'alert' : undefined}
        ref={cellRef}
        onMouseEnter={() => setOpen(true)}
      />

      <Transition
        in={error && open}
        unmountOnExit
        timeout={animateTimeout}
        nodeRef={popoverRef}
      >
        {(animate) => {
          return (
            <Popover
              className={cnMixPopoverAnimate({ animate })}
              offset="xs"
              anchorRef={cellRef}
              ref={popoverRef}
              direction="rightStartUp"
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
  },
];

export const TextFieldCellExampleAlertMessage = () => (
  <Example col={1}>
    <Table rows={rows} columns={columns} />
  </Example>
);
