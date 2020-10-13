import React, { useState } from 'react';
import { FormatPainterFilled, FormatPainterOutlined } from '@ant-design/icons';
import { Editor } from 'slate';
import { useSlate } from 'slate-react';
import { Button, Tooltip } from 'antd';
import { PluginProps } from '../index';

const config: PluginProps['props'] = {
  config: {
    title: { copy: '复制样式', use: '使用样式' },
  },
  ToolbarButton: React.memo(({ config }) => {
    const editor = useSlate();

    const marks = Editor.marks(editor);
    const isActive = Object.keys(marks || {}).length > 0;
    const [style, setStyle] = useState<any>({});

    return (
      <>
        <Tooltip title={config.title.copy}>
          <Button
            type="text"
            disabled={!isActive}
            onClick={() => {
              setStyle(marks);
            }}
            icon={<FormatPainterOutlined />}
          />
        </Tooltip>
        <Tooltip title={config.title.use}>
          <Button
            type="text"
            disabled={Object.keys(style).length === 0}
            onClick={() => {
              Object.keys(style).forEach(key => {
                editor.addMark(key, style[key]);
              });
            }}
            icon={<FormatPainterFilled />}
          />
        </Tooltip>
      </>
    );
  }),
};
export default config;
