import React, { useRef } from 'react';
import { EyeOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';

import { PluginProps } from '..';
import YEditor from '../..';
import { useSlate } from 'slate-react';

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

const config: PluginProps['props'] = {
  config: { title: '预览' },
  ToolbarButton: React.memo(({ config }) => {
    const ref = useRef<any>();
    const preview = (html: string) => {
      if (ref.current) {
        ref.current.close();
      }
      ref.current = window.open();
      ref.current.document.write(buildPreviewHtml(html));
      ref.current.document.close();
    };
    const editor = useSlate();
    const handleClick = () => {
      preview(YEditor.serialize(editor.children as any));
    };

    return (
      <Tooltip title={config.title}>
        <Button onClick={handleClick} type="text" icon={<EyeOutlined />} />
      </Tooltip>
    );
  }),
};

export default config;
