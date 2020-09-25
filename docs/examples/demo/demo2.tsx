import React from 'react';
import { YForm } from 'yforms';

// import 'antd/dist/antd.css';

export default () => {
  return (
    <div style={{ padding: 20 }}>
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
