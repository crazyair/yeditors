import React from 'react';
import { YForm } from 'yforms';

const Demo = () => {
  return (
    <div>
      <YForm>
        {[
          { type: 'input' },
          {
            type: 'radio',
            componentProps: { options: [{ id: '1', name: '2' }] },
          },
        ]}
      </YForm>
    </div>
  );
};
export default Demo;
