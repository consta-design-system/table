import { IconAlert } from '@consta/icons/IconAlert';
import { IconPhoto } from '@consta/icons/IconPhoto';
import { useBoolean, useNumber, useSelect, useText } from '@consta/stand';
import { Badge } from '@consta/uikit/Badge';
import { Loader } from '@consta/uikit/Loader';
import React, { useCallback, useState } from 'react';

import { Table, TableColumn, TableRenderCell } from '##/components/Table';

import { TextFieldCell } from '..';

type Row = { data: string };

const rows: Row[] = [{ data: 'Двойной клик' }];

const resizeMap = {
  true: true,
  false: false,
  auto: 'auto',
} as const;

const getStep = (
  type: string | undefined,
  withStepArray: boolean,
  step: number | undefined,
) => {
  if (type !== 'number') {
    return undefined;
  }

  if (withStepArray) {
    return [10, 50, 100];
  }

  return step;
};

const RenderCell: TableRenderCell<Row> = (row) => {
  const [value, setValue] = useState<string | null>(row.row.data);
  const [valueArray, setValueArray] = useState<string[] | null>([row.row.data]);
  const [inputValue, setInputValue] = useState<string | null>(null);
  const onChangeValueArray = useCallback((value: string[] | null) => {
    setValueArray(value);
    setInputValue(null);
  }, []);

  const size = useSelect('size', ['m', 's'], 'm');

  const type = useSelect(
    'type',
    ['text', 'number', 'password', 'textarea', 'textarray'],
    'text',
  );
  const resize =
    useSelect(
      'resize',
      ['false', 'true', 'auto'],
      'false',
      type === 'textarea',
    ) || 'false';

  const placeholder = useText('placeholder', 'placeholder');
  const rows = useNumber('rows', 3, type === 'textarea' && resize !== 'auto');
  const lineClamp = useNumber('lineClamp', 0);
  const minRows = useNumber(
    'minRows',
    1,
    type === 'textarea' && resize === 'auto',
  );
  const maxRows = useNumber(
    'maxRows',
    5,
    type === 'textarea' && resize === 'auto',
  );

  const step = useNumber('step', 1, type === 'number');
  const withStepArray = useBoolean('withStepArray', false, type === 'number');
  const incrementButtons = useBoolean(
    'incrementButtons',
    true,
    type === 'number',
  );
  const min = useNumber('min', 0, type === 'number');
  const max = useNumber('max', 150, type === 'number');

  const disabled = useBoolean('disabled', false);
  const clearButton = useBoolean('clearButton', true);
  const maxLength = useNumber('maxLength', 1000, type !== 'number');

  const leftSideType = useSelect('leftSideType', ['icon', 'text']);
  const leftSideText = useText('leftSideText', 'from');
  const rightSideType = useSelect('rightSideType', ['icon', 'text']);
  const rightSideText = useText('rightSideText', 'm²');
  const level = useNumber('level', 0);
  const status = useSelect('status', ['alert', 'warning']);

  const leftSideSelect = {
    text: leftSideText,
    icon: IconPhoto,
  };

  const rightSideSelect = {
    text: rightSideText,
    icon: IconPhoto,
  };

  const leftSide = leftSideType && leftSideSelect[leftSideType];
  const rightSide = rightSideType && rightSideSelect[rightSideType];

  const indicator = useSelect('indicator', ['alert', 'warning']);

  const props = {
    size,
    placeholder,
    type,
    disabled,
    clearButton,
    maxLength,
    leftSide,
    rightSide,
    level,
    lineClamp,
    status,
    indicator,
  };

  if (type === 'textarray') {
    return (
      <TextFieldCell
        {...props}
        value={valueArray}
        type={type}
        onChange={onChangeValueArray}
        readModeRender={(value) => value?.join(', ')}
        onInputChange={setInputValue}
        inputValue={inputValue}
      />
    );
  }

  if (type === 'textarea') {
    return (
      <TextFieldCell
        {...props}
        value={value}
        type={type}
        onChange={setValue}
        resize={resizeMap[resize]}
        minRows={resize === 'auto' ? minRows : undefined}
        rows={resize !== 'auto' ? rows : undefined}
      />
    );
  }

  if (type === 'number') {
    return (
      <TextFieldCell
        {...props}
        type={type}
        value={value}
        onChange={setValue}
        incrementButtons={type === 'number' ? incrementButtons : undefined}
        min={type === 'number' ? min : undefined}
        max={type === 'number' ? max : undefined}
        step={getStep(type, withStepArray, step)}
      />
    );
  }

  return (
    <TextFieldCell {...props} value={value} type={type} onChange={setValue} />
  );
};

const Variants = () => {
  const columns: TableColumn<Row>[] = [
    { title: 'Изменяемые данные', accessor: 'data', renderCell: RenderCell },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: 280,
        height: 200,
        padding: 'var(--space-m)',
      }}
    >
      <Table style={{ width: 280 }} rows={rows} columns={columns} />
    </div>
  );
};

export default Variants;
