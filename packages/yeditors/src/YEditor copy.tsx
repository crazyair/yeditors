import React, { useState } from 'react';
import { YForm } from 'yforms';
// import { Button, Modal } from 'antd';
import { Space } from 'antd';

// console.log('Space', Space);
const Demo = () => {
  const [visible, setVisible] = useState(false);
  const onFinish = (values: any) => {
    console.log('Success:', values);
  };
  // console.log('m', Modal);
  return (
    <div>
      {/* <Button onClick={() => setVisible(true)}>打开弹窗</Button> */}
      {/* <YForm.FormModal
        visible={visible}
        onCancel={() => setVisible(false)}
        destroyOnClose
        title="表单弹窗"
        formProps={{ onFinish }}
      >
        {[{ type: 'input', name: 'age', label: '姓名' }]}
      </YForm.FormModal> */}
      <YForm>
        {[
          { type: 'input' },
          {
            type: 'radio',
            componentProps: { options: [{ id: '1', name: '2' }] },
          },
        ]}
      </YForm>
      {/* <Modal visible={visible} title="Title" onCancel={() => setVisible(false)}>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal> */}
    </div>
  );
};
export default Demo;
