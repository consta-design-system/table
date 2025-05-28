import { Example } from '@consta/stand';
import { Text } from '@consta/uikit/Text';
import React, { useState } from 'react';

import { Pagination } from '../../..';

export const PaginationOnStepChangeExample = () => {
  const [step, setStep] = useState(10);
  return (
    <Example col={1}>
      <Pagination step={step} onStepChange={setStep} />
      <Text>Шаг - {step}</Text>
    </Example>
  );
};
