import { Example } from '@consta/stand';
import { Button } from '@consta/uikit/Button';
import React from 'react';

import { Collapse } from '##/components/Collapse';

export const CollapseExampleContent = () => {
  return (
    <Example col={1}>
      <Collapse
        leftSide="Заголовок"
        rightSide={[
          <Button label="Кнопка" size="s" view="ghost" form="round" />,
          <Button label="Кнопка 2" size="s" form="round" />,
        ]}
      >
        Content
      </Collapse>
    </Example>
  );
};
