import { useNumber, useSelect, useText } from '@consta/stand';
import { useAtom } from '@reatom/react';
import React, { useEffect } from 'react';

import { Pagination } from '..';

const stepsMap = {
  '[10, 25, 50, 100, 1000]': [10, 25, 50, 100, 1000],
  '[15, 30, 50]': [15, 30, 50],
};

const stepsOptions = [`[10, 25, 50, 100, 1000]`, `[15, 30, 50]`] as const;

const Variants = () => {
  const label = useText('label', 'Строк на странице');
  const total = useNumber('total', 300);
  const steps =
    useSelect('steps', stepsOptions, stepsOptions[0]) || stepsOptions[0];
  const [step, setStep] = useAtom(stepsMap[steps][0]);

  useEffect(() => {
    setStep(stepsMap[steps][0]);
  }, [steps]);

  return (
    <div style={{ width: '100%' }}>
      <Pagination
        label={label}
        total={total}
        steps={stepsMap[steps]}
        step={step}
        onStepChange={setStep}
      />
    </div>
  );
};

export default Variants;
