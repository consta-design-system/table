import React from 'react';

import data from '../__mocks__/olympic-winners.json';
import { Table } from '../Table';

const Variants = () => {
  return (
    <div style={{ position: 'absolute', height: '100%', width: '100%' }}>
      <Table
        rows={data}
        columns={[
          {
            title: 'Атлет',
            columns: [
              { title: 'Имя', accessor: 'athlete' },
              { title: 'Страна', accessor: 'country' },
              { title: 'Возраст', accessor: 'age' },
            ],
          },
          { title: 'Вид спрота', accessor: 'sport' },
          {
            title: 'Медали',
            columns: [
              {
                title: 'Бронза',
                accessor: 'bronze',
              },
              {
                title: 'Серебро',
                accessor: 'silver',
              },
              {
                title: 'Золото',
                accessor: 'gold',
              },
              {
                title: 'Всего',
                accessor: 'total',
              },
            ],
          },
          { title: 'Год', accessor: 'year' },
          { title: 'Дата', accessor: 'date' },
          {
            title: 'Тест',
            columns: [
              {
                title: 'Тест2',
                columns: [
                  {
                    title: 'Бронза',
                    accessor: 'bronze',
                  },
                  {
                    title: 'Серебро',
                    accessor: 'silver',
                  },
                  {
                    title: 'Золото',
                    accessor: 'gold',
                  },
                  {
                    title: 'Всего',
                    accessor: 'total',
                  },
                ],
              },
              {
                title: 'Тест3',
                columns: [
                  {
                    title: 'Бронза',
                    accessor: 'bronze',
                  },
                  {
                    title: 'Серебро',
                    accessor: 'silver',
                  },
                  {
                    title: 'Золото',
                    accessor: 'gold',
                  },
                  {
                    title: 'Всего',
                    accessor: 'total',
                  },
                ],
              },
            ],
          },
        ]}
      />
    </div>
  );
};

export default Variants;
