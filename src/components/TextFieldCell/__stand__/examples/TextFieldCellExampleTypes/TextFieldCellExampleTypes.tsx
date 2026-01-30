import { Example } from '@consta/stand';
import React, { useCallback, useState } from 'react';

import { Table, TableColumn, TableRenderCell } from '##/components/Table';
import { TextFieldCell } from '##/components/TextFieldCell';

type Row = {
  text: string;
  textarea: string;
  textareaAutosize: string;
  number: string;
  textArray: string[];
};

const rows: Row[] = [
  {
    text: 'value1',
    textarea: 'value2',
    textareaAutosize: 'value3',
    number: 'value4',
    textArray: ['value5', 'value6'],
  },
];

const CellTypeText: TableRenderCell<Row> = (row) => {
  const [value, setValue] = useState<string | null>(row.row.text);

  return (
    <TextFieldCell type="text" value={value} onChange={setValue} size="m" />
  );
};

const CellTypeTextArea: TableRenderCell<Row> = (row) => {
  const [value, setValue] = useState<string | null>(row.row.textarea);

  return (
    <TextFieldCell
      type="textarea"
      value={value}
      onChange={setValue}
      size="m"
      rows={3}
      lineClamp={6}
      resize
      clearButton
    />
  );
};

const CellTypeTextAreaAutosize: TableRenderCell<Row> = (row) => {
  const [value, setValue] = useState<string | null>(row.row.textareaAutosize);

  return (
    <TextFieldCell
      type="textarea"
      value={value}
      resize="auto"
      maxRows={6}
      lineClamp={6}
      onChange={setValue}
      size="m"
      clearButton
    />
  );
};

const CellTypeNumber: TableRenderCell<Row> = (row) => {
  const [value, setValue] = useState<string | null>(row.row.number);

  return (
    <TextFieldCell
      type="number"
      value={value}
      incrementButtons
      clearButton
      onChange={setValue}
      size="m"
    />
  );
};

const CellTypeTextArray: TableRenderCell<Row> = (row) => {
  const [value, setValue] = useState<string[] | null>(row.row.textArray);

  const [inputValue, setInputValue] = useState<string | null>(null);
  const onChangeValueArray = useCallback((value: string[] | null) => {
    setValue(value);
    setInputValue(null);
  }, []);

  return (
    <TextFieldCell
      type="textarray"
      value={value}
      clearButton
      onChange={onChangeValueArray}
      inputValue={inputValue}
      onInputChange={setInputValue}
      readModeRender={(value) => value?.join(', ')}
      size="m"
    />
  );
};

const columns: TableColumn<Row>[] = [
  {
    title: 'TextArray',
    accessor: 'textArray',
    renderCell: CellTypeTextArray,
    minWidth: 200,
  },
  {
    title: 'Text',
    accessor: 'text',
    renderCell: CellTypeText,
    minWidth: 200,
  },

  {
    title: 'Textarea',
    accessor: 'textarea',
    renderCell: CellTypeTextArea,
    minWidth: 200,
  },
  {
    title: 'Textarea autosize',
    accessor: 'textareaAutosize',
    renderCell: CellTypeTextAreaAutosize,
    minWidth: 200,
  },

  {
    title: 'Number',
    accessor: 'number',
    renderCell: CellTypeNumber,
    minWidth: 200,
  },
];

export const TextFieldCellExampleTypes = () => (
  <Example col={1}>
    <Table rows={rows} columns={columns} />
  </Example>
);
