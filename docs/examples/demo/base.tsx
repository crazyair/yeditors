import React, { useRef } from 'react';
import { YForm } from 'yforms';
import { message } from 'antd';
// import { useClipboard } from 'use-clipboard-copy';
import { YEditor } from 'yeditors';

export default (props: any) => {
  const { initialValue, data } = props;
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

  // const clipboard = useClipboard();

  return (
    <div style={{ padding: 20 }}>
      <YForm
        name="basic"
        form={form}
        scenes={{ noCol: true }}
        getInitialValues={async () => {
          return { content: JSON.stringify(initialValue) };
        }}
      >
        {[
          {
            type: 'custom',
            name: 'content',
            deFormat: (value) => value && JSON.parse(value),
            format: (value) => JSON.stringify(value),
            children: <YEditor dataSource={data} />,
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
                    // clipboard.copy(buildPreviewHtml(str));
                    message.success('复制成功');
                  },
                  children: '复制 HTML',
                },
              },
            ],
          },
        ]}
      </YForm>
    </div>
  );
};
