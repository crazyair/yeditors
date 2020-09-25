import React, { useRef } from 'react';
import { YForm } from 'yforms';
import { Card, message } from 'antd';
import { useRouteMatch } from 'umi';
import { useClipboard } from 'use-clipboard-copy';
import { YEditor } from 'yeditors';
// import 'antd/dist/antd.css';

const initialValue = [
  {
    type: 'paragraph',
    children: [
      { text: 'This is editable ' },
      { text: 'rich', bold: true },
      { text: ' text, ' },
      { text: 'much', italic: true },
      { text: ' better than a ' },
      { text: '<textarea>', code: true },
      { text: '!' },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text:
          "Since it's rich text, you can do things like turn a selection of text ",
      },
      { text: 'bold', bold: true },
      { text: ', or add a semantically rendered block , like this:' },
    ],
  },
  { type: 'block-quote', children: [{ text: 'A wise quote.' }] },
  { type: 'paragraph', children: [{ text: 'Try it out for yourself!' }] },
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
      children2: [{ name: '第二层', children3: [{ name: '第三层' }] }],
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
          { type: 'input', label: 'title', name: 'title' },
          {
            type: 'custom',
            label: '模板',
            name: 'content',
            scenes: { required: false },
            deFormat: value => value && JSON.parse(value),
            format: value => JSON.stringify(value),
            children: <YEditor />,
          },
          // {
          //   type: 'yEditor2',
          //   label: '模板',
          //   scenes: { yEditor2: true },
          //   componentProps: { formatData: data },
          //   name: 'content',
          // },
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
                    // YEditor.serialize(html, data);
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
