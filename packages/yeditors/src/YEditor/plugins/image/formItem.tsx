import React, { useState } from 'react';
import { Transforms } from 'slate';
import { YForm } from 'yforms';
import { useSlate } from 'slate-react';
import { YFormItemProps } from 'yforms/lib/YForm/Items';

const _url =
  'https://accumulus-com.oss-cn-hzfinance.aliyuncs.com/b7ab3f4c150f4abd8c36bf18ff0aaa88.png';

const ImageForm = (props: any) => {
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
          name: 'src',
          componentProps: { autoFocus: true },
          label: '链接',
        },
        {
          type: 'radio',
          name: ['blockStyle', 'textAlign'],
          label: '位置',
          scenes: { required: false },
          deFormat: value => value || 'center',
          componentProps: {
            options: [
              { id: 'left', name: '居左' },
              { id: 'center', name: '居中' },
              { id: 'right', name: '居右' },
            ],
          },
        },
        {
          type: 'radio',
          label: '宽度',
          name: 'width',
          scenes: { required: false },
          componentProps: {
            options: [
              { id: '', name: '默认' },
              { id: '150px', name: '150px' },
              { id: '300px', name: '300px' },
              { id: '450px', name: '450px' },
              { id: '100%', name: '100%' },
            ],
          },
        },
        {
          type: 'select',
          label: '蒙层',
          name: ['style', 'boxShadow'],
          scenes: { required: false },
          componentProps: {
            options: [
              { id: '1px 1px 10px #ccc', name: '样式1' },
              { id: '1px 1px 20px #ccc', name: '样式2' },
            ],
          },
        },
        {
          label: '边框',
          type: 'oneLine',
          componentProps: { oneLineStyle: ['33%', '33%', '33%'] },
          scenes: { required: false },
          items: (): YFormItemProps['children'] => [
            {
              hideLable: '大小',
              type: 'select',
              name: ['style', 'borderWidth'],
              componentProps: {
                options: [
                  { id: '1px', name: '1像素' },
                  { id: '2px', name: '2像素' },
                  { id: '3px', name: '3像素' },
                ],
              },
            },
            {
              hideLable: '样式',
              type: 'select',
              name: ['style', 'borderStyle'],
              componentProps: {
                options: [
                  { id: 'solid', name: '实线' },
                  { id: 'dotted', name: '圆点' },
                  { id: 'dashed', name: '虚线' },
                ],
              },
            },
            {
              hideLable: '颜色',
              type: 'select',
              name: ['style', 'borderColor'],
              componentProps: {
                options: [
                  { id: 'black', name: '黑色' },
                  { id: '#cccccc', name: '灰色' },
                ],
              },
            },
          ],
        },
      ]}
    </YForm.FormModal>
  );
};

export default (props: any) => {
  const { children, initialValues } = props;
  const editor = useSlate();
  const [visible, setVisible] = useState(false);
  const onFinish = (values: any) => {
    const data = { type: 'image', props: values, children: [{ text: '' }] };
    if (initialValues) {
      Transforms.setNodes(editor, data);
    } else {
      Transforms.insertNodes(editor, [
        data,
        { type: 'paragraph', children: [{ text: '' }] },
      ]);
    }
  };

  return (
    <>
      {React.cloneElement(children, { onClick: () => setVisible(true) })}
      <ImageForm
        visible={visible}
        onCancel={() => setVisible(false)}
        formProps={{
          minBtnLoadingTime: 0,
          onFinish,
          initialValues: {
            src: _url,
            ...initialValues,
          },
        }}
      />
    </>
  );
};
