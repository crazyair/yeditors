import React, { useRef } from 'react';
import { CopyOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import { useClipboard } from 'use-clipboard-copy';

import { PluginProps } from '..';
import YEditor from '../..';
import { useSlate } from 'slate-react';

const buildPreviewHtml = (html: any) => {
  return `
    <!Doctype html>
    <html>
      <head>
        <title>预览</title>
      </head>
      <body>
        <div class="container" style="padding: 0;margin: 0 auto;min-width: 320px;max-width: 620px;box-shadow: 1px 1px 20px rgba(99,99,99,.1);">${html}</div>
      </body>
    </html>
  `;
};

const config: PluginProps['props'] = {
  config: {},
  ToolbarButton: React.memo(({ dataSource }) => {
    const editor = useSlate();
    const clipboard = useClipboard();
    const ref = useRef<any>();
    const preview = (html: string) => {
      if (ref.current) {
        ref.current.close();
      }
      ref.current = window.open();
      ref.current.document.write(html);
      ref.current.document.close();
    };
    const handleClick = (isCopy?: boolean) => {
      const html = buildPreviewHtml(
        YEditor.serialize(editor.children as any, { data: dataSource }),
      );
      if (isCopy) {
        clipboard.copy(html);
      } else {
        preview(html);
      }
    };

    return (
      <>
        <Tooltip title="预览">
          <Button
            onClick={() => handleClick()}
            type="text"
            icon={<EyeOutlined />}
          />
        </Tooltip>
        <Tooltip title="复制 HTML">
          <Button
            onClick={() => handleClick(true)}
            type="text"
            icon={<CopyOutlined />}
          />
        </Tooltip>
      </>
    );
  }),
};

export default config;
