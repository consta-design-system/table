import { Example } from '@consta/stand';
import { Text } from '@consta/uikit/Text';
import React, { useState } from 'react';

import { Pagination } from '../../..';

export const PaginationStepsExample = () => {
  const [step, setStep] = useState(10);
  return (
    <Example col={1}>
      <Pagination step={step} onStepChange={setStep} steps={[10, 20, 30]} />
      <Text>Шаг - {step}</Text>
    </Example>
  );
};
