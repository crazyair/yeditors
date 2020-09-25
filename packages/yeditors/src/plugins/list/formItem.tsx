import React, { useState } from 'react';
import { YForm } from 'yforms';
import { Transforms } from 'slate';
import { useSlate } from 'slate-react';
import { map, split, trim } from 'lodash';

const key = 'list';

export default (props: any) => {
  const { children, initialValues } = props;
  const editor = useSlate();
  const [visible, setVisible] = useState(false);

  const onFinish = (values: any) => {
    const data = {
      type: key,
      props: values,
      children: [{ type: 'paragraph', children: [{ text: '' }] }],
    };
    if (initialValues) {
      Transforms.setNodes(editor, data, { match: n => n.type === key });
    } else {
      Transforms.insertNodes(editor, [
        data,
        { type: 'paragraph', children: [{ text: '' }] },
      ]);
    }
  };
  return (
    <>
      {React.cloneElement(children, {
        onClick: () => {
          setVisible(true);
        },
      })}
      <YForm.FormModal
        visible={visible}
        onCancel={() => setVisible(false)}
        destroyOnClose
        title="块"
        formProps={{ minBtnLoadingTime: 0, onFinish, initialValues }}
      >
        {[
          {
            type: 'input',
            scenes: { required: false },
            name: 'field',
            label: '数组值',
            extra:
              '如果有值，则内部 ${xx} 会使用 value[index].xx 获取值 ${list[index].age} ${name}',
          },
          {
            type: 'textarea',
            scenes: { required: false },
            format: value => {
              return (
                value && map(split(value, ';'), item => trim(item)).join(';\n')
              );
            },
            name: 'style',
            label: '样式',
            componentProps: { placeholder: 'color: red; \nfontSize: 14px;' },
          },
          {
            type: 'button',
            componentProps: {
              children: '清除',
              onClick: () => {
                Transforms.unwrapNodes(editor, { match: n => n.type === key });
              },
            },
          },
        ]}
      </YForm.FormModal>
    </>
  );
};
