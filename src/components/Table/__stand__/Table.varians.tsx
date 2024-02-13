import React from 'react';

import { Table } from '../Table';

const Variants = () => {
  return (
    <Table
      rows={[{ name: 'ss', ff: 'ss' }]}
      columns={[{ title: 'dd', renderCell: (props) => <div>{props.ff}</div> }]}
    />
  );
};

export default Variants;
