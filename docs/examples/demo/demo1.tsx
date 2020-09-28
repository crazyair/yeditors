import React, { useRef } from 'react';
import { YForm } from 'yforms';
import { message } from 'antd';
import { useRouteMatch } from 'umi';
import { useClipboard } from 'use-clipboard-copy';
import { YEditor } from 'yeditors';

const initialValue = [
  {
    type: 'paragraph',
    children: [
      {
        text: '多层级坑位',
      },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text: '',
      },
    ],
  },
  {
    type: 'list',
    props: {
      field: 'children',
    },
    children: [
      {
        type: 'paragraph',
        children: [
          {
            text: '${name}',
          },
        ],
      },
      {
        type: 'list',
        props: {
          field: 'children',
          style: 'margin:0 20px',
        },
        children: [
          {
            type: 'paragraph',
            children: [
              {
                text: '${name}',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text: '',
      },
    ],
  },
];
const data = {
  name: '张三',
  age: '10',
  list: [
    { name: '张三1', age: '101' },
    { name: '张三2', age: '102' },
    { name: '张三3', age: '103' },
  ],
  children: [
    {
      name: '第一层',
      children: [{ name: '第二层', children: [{ name: '第三层' }] }],
    },
  ],
};
export default () => {
  const match = useRouteMatch();
  const { submit } = YForm.useSubmit({ params: match.params });
  const [form] = YForm.useForm();
  const buildPreviewHtml = (html: any) => {
    return `
      <!Doctype html>
      <html>
        <head>
          <title>Preview Content</title>
        </head>
        <body>
          <div class="container" style="padding: 0;margin: 0 auto;min-width: 320px;max-width: 620px;box-shadow: 1px 1px 20px rgba(99,99,99,.1);">${html}</div>
        </body>
      </html>
    `;
  };

  const ref = useRef<any>();
  const preview = (html: string) => {
    if (ref.current) {
      ref.current.close();
    }
    ref.current = window.open();
    ref.current.document.write(buildPreviewHtml(html));
    ref.current.document.close();
  };

  const onFinish = async (values: any) => {
    console.log('v', values);
  };
  const clipboard = useClipboard();

  return (
    <div style={{ padding: 20 }}>
      <YForm
        name="basic"
        form={form}
        scenes={{ noSaveForm: true }}
        submit={submit}
        onFinish={onFinish}
        onCancel={() => {}}
        params={match.params}
        getInitialValues={async () => {
          return { content: JSON.stringify(initialValue) };
        }}
      >
        {[
          {
            type: 'custom',
            label: '模板',
            name: 'content',
            scenes: { required: false },
            deFormat: value => value && JSON.parse(value),
            format: value => JSON.stringify(value),
            children: <YEditor />,
          },
          {
            type: 'space',
            items: [
              {
                type: 'button',
                componentProps: {
                  onClick: () => {
                    const html = form.getFieldsValue().content;
                    preview(YEditor.serialize(html, { data }));
                  },
                  children: '预览',
                },
              },
              {
                type: 'button',
                componentProps: {
                  onClick: () => {
                    const html = form.getFieldsValue().content;
                    console.log(JSON.stringify(html, null, 2));
                    const str = YEditor.serialize(html, { data });
                    console.log(str);
                    clipboard.copy(buildPreviewHtml(str));
                    message.success('复制成功');
                  },
                  children: '复制 HTML',
                },
              },
            ],
          },
          { type: 'submit' },
        ]}
      </YForm>
    </div>
  );
};
