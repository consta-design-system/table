import { Example } from '@consta/stand';
import { Informer } from '@consta/uikit/Informer';
import {
  animateTimeout,
  cnMixPopoverAnimate,
} from '@consta/uikit/MixPopoverAnimate';
import { Popover } from '@consta/uikit/Popover';
import { useDebounce } from '@consta/uikit/useDebounce';
import { useFlag } from '@consta/uikit/useFlag';
import React, { useCallback, useRef } from 'react';
import { Transition } from 'react-transition-group';

import { DataCell } from '##/components/DataCell';
import { Table, TableColumn } from '##/components/Table';

type Cell<T> = {
  data: T;
  status?: 'alert' | 'warning';
  statusMessage?: string;
};

type Row = {
  name: Cell<string>;
  profession: Cell<string>;
  status: Cell<string>;
};

const rows: Row[] = [
  {
    name: {
      data: 'Антон',
    },
    profession: {
      data: 'РОЮЛАВТМЯО',
      status: 'alert',
      statusMessage: 'Неизвестное название диапазона: РОЮЛАВТМЯО.',
    },
    status: {
      data: 'недоступен',
    },
  },
  {
    name: {
      data: 'Василий',
      status: 'warning',
      statusMessage: 'Не числится в штате',
    },
    profession: { data: 'Отвечает на вопросы, хотя его не спросили' },
    status: {
      data: 'недоступен',
    },
  },
  {
    name: {
      data: 'Максим',
    },
    profession: {
      data: 'Решает математические задачи',
    },
    status: {
      data: 'доступен',
    },
  },
  {
    name: {
      data: 'Анна',
    },
    profession: {
      data: 'Рисует картины',
    },
    status: {
      data: 'недоступен',
    },
  },
  {
    name: {
      data: 'Игорь',
    },
    profession: {
      data: 'Изучает иностранные языки',
    },
    status: {
      data: 'доступен',
    },
  },
  {
    name: {
      data: 'Ольга',
    },
    profession: {
      data: 'Путешествует по миру',
    },
    status: {
      data: 'недоступен',
    },
  },
  {
    name: {
      data: 'Денис',
    },
    profession: {
      data: 'Занимается йогой',
    },
    status: {
      data: 'доступен',
    },
  },
  {
    name: {
      data: 'Наташа',
    },
    profession: {
      data: 'Плавает на доске волн',
    },
    status: {
      data: 'недоступен',
    },
  },
  {
    name: {
      data: 'Кирилл',
    },
    profession: {
      data: 'Собирает коллекцию стикеров',
    },
    status: {
      data: 'доступен',
    },
  },
  {
    name: {
      data: 'Елена',
    },
    profession: {
      data: 'Вышивает крестиком',
    },
    status: {
      data: 'недоступен',
    },
  },
  {
    name: {
      data: 'Алексей',
    },
    profession: {
      data: 'Готовит домашние сладости',
    },
    status: {
      data: 'доступен',
    },
  },
  {
    name: {
      data: 'Марина',
    },
    profession: {
      data: 'Учится играть на гитаре',
    },
    status: {
      data: 'недоступен',
    },
  },
  {
    name: {
      data: 'Сергей',
    },
    profession: {
      data: 'Ухаживает за растениями',
    },
    status: {
      data: 'доступен',
    },
  },
  {
    name: {
      data: 'Татьяна',
    },
    profession: {
      data: 'Шьет одежду',
    },
    status: {
      data: 'недоступен',
    },
  },
  {
    name: {
      data: 'Иван',
    },
    profession: {
      data: 'Читает книги',
    },
    status: {
      data: 'доступен',
    },
  },
  {
    name: {
      data: 'Людмила',
    },
    profession: {
      data: 'Фотографирует природу',
    },
    status: {
      data: 'На работе',
      status: 'alert',
      statusMessage: 'Неизвестное название диапазона: На работе.',
    },
  },
  {
    name: {
      data: 'Павел',
    },
    profession: {
      data: 'Изучает астрономию',
    },
    status: {
      data: 'доступен',
    },
  },
  {
    name: {
      data: 'Юлия',
    },
    profession: {
      data: 'ВДПШСЫЭЭЭКДА',
      status: 'alert',
      statusMessage: 'Неизвестное название диапазона: ВДПШСЫЭЭЭКДА.',
    },
    status: {
      data: 'недоступен',
    },
  },
  {
    name: {
      data: 'Владимир',
    },
    profession: {
      data: 'Играет в шахматы',
    },
    status: {
      data: 'доступен',
    },
  },
  {
    name: {
      data: 'София',
    },
    profession: {
      data: 'Печет пироги',
    },
    status: {
      data: 'недоступен',
    },
  },
];

const titleMap: Record<'alert' | 'warning', string> = {
  alert: 'Ошибка',
  warning: 'Предупреждение',
};

const DataCellWithInformer = ({
  data,
  tableRef,
  statusMessage,
  status,
}: {
  data: string;
  status?: 'alert' | 'warning';
  statusMessage?: string;
  tableRef: React.RefObject<HTMLDivElement>;
}) => {
  const cellRef = useRef<HTMLDivElement>(null);
  const popoverContentRef = useRef<HTMLDivElement>(null);
  const [informerVisible, setInformerVisible] = useFlag();

  const hoverStateRef = useRef<{
    popover: boolean;
    anchor: boolean;
  }>({
    popover: false,
    anchor: false,
  });

  const mouseEnterController = useDebounce(
    useCallback(() => {
      (hoverStateRef.current.anchor || hoverStateRef.current.popover) &&
        setInformerVisible.on();
    }, []),
    200,
  );

  const mouseLeaveController = useDebounce(
    useCallback(() => {
      !hoverStateRef.current.anchor &&
        !hoverStateRef.current.popover &&
        setInformerVisible.off();
    }, []),
    200,
  );

  const anchorOnMouseEnter: React.MouseEventHandler<HTMLDivElement> =
    useCallback((e) => {
      hoverStateRef.current.anchor = true;
      mouseEnterController();
    }, []);

  const anchorOnMouseLeave: React.MouseEventHandler<HTMLDivElement> =
    useCallback((e) => {
      hoverStateRef.current.anchor = false;
      mouseLeaveController();
    }, []);

  const popoverOnMouseEnter: React.MouseEventHandler<HTMLDivElement> =
    useCallback((e) => {
      hoverStateRef.current.popover = true;
      mouseEnterController();
    }, []);

  const popoverOnMouseLeave: React.MouseEventHandler<HTMLDivElement> =
    useCallback((e) => {
      hoverStateRef.current.popover = false;
      mouseLeaveController();
    }, []);

  return (
    <>
      <DataCell
        ref={cellRef}
        onClick={setInformerVisible.toggle}
        indicator={status}
        onMouseEnter={anchorOnMouseEnter}
        onMouseLeave={anchorOnMouseLeave}
      >
        {status === 'alert' ? '#ТИПДАННЫХ?' : data}
      </DataCell>
      {status && (
        <Transition
          in={informerVisible}
          unmountOnExit
          timeout={animateTimeout}
          nodeRef={popoverContentRef}
        >
          {(animate) => (
            <Popover
              className={cnMixPopoverAnimate({ animate })}
              viewportRef={tableRef}
              ref={popoverContentRef}
              anchorRef={cellRef}
              style={{ zIndex: 100 }}
              possibleDirections={[
                'leftStartUp',
                'rightStartUp',
                'leftStartDown',
                'rightStartDown',
                'upStartLeft',
                'upStartRight',
                'downCenter',
                'upCenter',
              ]}
              onMouseEnter={popoverOnMouseEnter}
              onMouseLeave={popoverOnMouseLeave}
            >
              <Informer
                title={titleMap[status]}
                label={statusMessage}
                view="bordered"
                status={status}
              />
            </Popover>
          )}
        </Transition>
      )}
    </>
  );
};

const columns: TableColumn<Row>[] = [
  {
    title: 'Имя',
    accessor: 'name',
    renderCell: ({ row, tableRef }) => (
      <DataCellWithInformer
        data={row.name.data}
        status={row.name.status}
        statusMessage={row.name.statusMessage}
        tableRef={tableRef}
      />
    ),
  },
  {
    title: 'Профессия',
    accessor: 'profession',
    renderCell: ({ row, tableRef }) => (
      <DataCellWithInformer
        data={row.profession.data}
        status={row.profession.status}
        statusMessage={row.profession.statusMessage}
        tableRef={tableRef}
      />
    ),
  },
  {
    title: 'Статус',
    accessor: 'status',
    renderCell: ({ row, tableRef }) => (
      <DataCellWithInformer
        data={row.status.data}
        status={row.status.status}
        statusMessage={row.status.statusMessage}
        tableRef={tableRef}
      />
    ),
  },
];

export const TableExampleWithIndicator = () => {
  return (
    <Example col={1}>
      <Table style={{ maxHeight: 400 }} rows={rows} columns={columns} />
    </Example>
  );
};
