import React, { useState } from 'react';
import { YForm } from 'yforms';
import { Node } from 'slate';
import { useSlate } from 'slate-react';
import { editLink, insertLink } from '../../utils';

const LinkForm = (props: any) => {
  const { visible, setVisible } = props;
  return (
    <YForm.FormModal
      visible={visible}
      onCancel={() => setVisible(false)}
      destroyOnClose
      title="添加图片"
      {...props}
    >
      {[
        {
          type: 'input',
          name: 'href',
          componentProps: { autoFocus: true },
          label: '链接',
        },
        { type: 'input', name: 'text', label: '标题' },
        {
          type: 'radio',
          name: 'target',
          label: '打开方式',
          scenes: { required: false },
          deFormat: value => value || '_blank',
          componentProps: {
            options: [
              { id: '_blank', name: '新窗口' },
              { id: '_self', name: '当前窗口' },
            ],
          },
        },
      ]}
    </YForm.FormModal>
  );
};

export default (props: any) => {
  const { children, initialValues } = props;
  const editor = useSlate();
  const [visible, setVisible] = useState(false);
  const [form] = YForm.useForm();

  const onFinish = (values: any) => {
    const { text, ...rest } = values;
    if (initialValues) {
      editLink(editor, rest, text);
    } else {
      insertLink(editor, rest, text);
    }
  };
  return (
    <>
      {React.cloneElement(children, {
        onClick: () => {
          if (!initialValues) {
            form.setFields([
              {
                name: 'text',
                value: Node.string({ children: editor.getFragment() }),
              },
              { name: 'href', value: '' },
            ]);
          }
          setVisible(true);
        },
      })}
      <LinkForm
        visible={visible}
        onCancel={() => setVisible(false)}
        formProps={{
          minBtnLoadingTime: 0,
          onFinish,
          form,
          initialValues: {
            ...initialValues,
          },
        }}
      />
    </>
  );
};
