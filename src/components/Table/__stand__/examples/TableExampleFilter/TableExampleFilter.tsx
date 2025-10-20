import { IconFunnel } from '@consta/icons/IconFunnel';
import { Example } from '@consta/stand';
import { Button } from '@consta/uikit/Button';
import { FlatSelect } from '@consta/uikit/FlatSelect';
import { atom } from '@reatom/core';
import { useAtom } from '@reatom/npm-react';
import React, { useRef } from 'react';

import { HeaderDataCell } from '##/components/HeaderDataCell';
import { Table, TableColumn, TableRenderHeaderCell } from '##/components/Table';

const dataAtom = atom<ROW[]>([
  {
    name: 'Антон Григорьев',
    profession: 'Строитель, который построил дом',
    status: 'недоступен',
  },
  {
    name: 'Василий Пупкин',
    profession: 'Отвечает на вопросы, хотя его не спросили',
    status: 'на связи',
  },
]);

const statusFilterValueAtom = atom<string[]>([]);
const nameFilterValueAtom = atom<string[]>([]);

const rowsAtom = atom<ROW[]>((ctx) => {
  const data = ctx.spy(dataAtom);
  const statusFilterValue = ctx.spy(statusFilterValueAtom);
  const nameFilterValue = ctx.spy(nameFilterValueAtom);

  return data.filter((row) => {
    return (
      (nameFilterValue.length
        ? nameFilterValue.some((el) =>
            row.name.toLowerCase().includes(el.toLowerCase()),
          )
        : true) &&
      (statusFilterValue.length
        ? statusFilterValue.some((el) =>
            row.status.toLowerCase().includes(el.toLowerCase()),
          )
        : true)
    );
  });
});

type ROW = {
  name: string;
  profession: string;
  status: string;
};

const nameFilterItems = ['Антон Григорьев', 'Василий Пупкин'];
const statusFilterItems = ['недоступен', 'на связи'];

const NameHeaderCell: TableRenderHeaderCell = ({ title }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [nameFilterValue, setNameFilterValue] = useAtom(nameFilterValueAtom);
  return (
    <>
      <HeaderDataCell
        controlRight={
          <Button
            ref={buttonRef}
            size="s"
            iconLeft={IconFunnel}
            view={nameFilterValue.length ? 'secondary' : 'clear'}
            onlyIcon
          />
        }
      >
        {title}
      </HeaderDataCell>
      <FlatSelect
        anchorRef={buttonRef}
        value={nameFilterValue}
        getItemLabel={(item) => item}
        getItemKey={(item) => item}
        onChange={(value) => setNameFilterValue(value || [])}
        items={nameFilterItems}
        multiple
        style={{ zIndex: 10 }}
      />
    </>
  );
};

const StatusHeaderCell: TableRenderHeaderCell = ({ title }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [statusFilterValue, setStatusFilterValue] = useAtom(
    statusFilterValueAtom,
  );
  return (
    <>
      <HeaderDataCell
        controlRight={
          <Button
            ref={buttonRef}
            size="s"
            view={statusFilterValue.length ? 'secondary' : 'clear'}
            iconLeft={IconFunnel}
            onlyIcon
          />
        }
      >
        {title}
      </HeaderDataCell>
      <FlatSelect
        anchorRef={buttonRef}
        value={statusFilterValue}
        getItemLabel={(item) => item}
        getItemKey={(item) => item}
        onChange={(value) => setStatusFilterValue(value || [])}
        items={statusFilterItems}
        multiple
        style={{ zIndex: 10 }}
      />
    </>
  );
};

const columns: TableColumn<ROW>[] = [
  {
    title: 'Имя',
    accessor: 'name',
    width: 240,
    renderHeaderCell: NameHeaderCell,
  },
  {
    title: 'Профессия',
    accessor: 'profession',
    width: '1fr',
  },
  {
    title: 'Статус',
    accessor: 'status',
    width: '1fr',
    minWidth: 150,
    renderHeaderCell: StatusHeaderCell,
  },
];

export const TableExampleFilter = () => {
  const [rows] = useAtom(rowsAtom);
  return (
    <Example col={1}>
      <Table rows={rows} columns={columns} />
    </Example>
  );
};
