import React, { useState } from 'react';
import { YForm } from 'yforms';
import { Transforms } from 'slate';
import { useSlate } from 'slate-react';

const LinkForm = (props: any) => {
  const { visible, setVisible } = props;
  return (
    <YForm.FormModal
      visible={visible}
      onCancel={() => {
        setVisible(false);
      }}
      destroyOnClose
      title="添加占位符"
      {...props}
    >
      {[
        {
          type: 'input',
          name: 'text',
          format: value => {
            return `$\{${value}}`;
          },
          deFormat: (value?: string) => {
            if (value) {
              return value.replace(/\$\{[^}]+\}/g, '');
            }
          },
          componentProps: { autoFocus: true },
          label: '字段',
        },
      ]}
    </YForm.FormModal>
  );
};

export default (props: any) => {
  const { children } = props;
  const editor = useSlate();
  const [visible, setVisible] = useState(false);
  const [form] = YForm.useForm();

  const onFinish = (values: any) => {
    Transforms.insertText(editor, values.text);
  };
  return (
    <>
      {React.cloneElement(children, {
        onClick: () => {
          form.resetFields();
          setVisible(true);
        },
      })}
      <LinkForm
        visible={visible}
        onCancel={() => setVisible(false)}
        editor={editor}
        formProps={{
          minBtnLoadingTime: 0,
          onFinish,
          form,
        }}
      />
    </>
  );
};
