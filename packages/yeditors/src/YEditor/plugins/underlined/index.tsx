import React from 'react';
import { UnderlineOutlined } from '@ant-design/icons';
import { get } from 'lodash';
import { Editor } from 'slate';
import { useSlate } from 'slate-react';
import { Button, Tooltip } from 'antd';
import { activeStyle } from '../../utils';
import { PluginProps } from '..';

const key = 'underline';

const config: PluginProps['props'] = {
  config: {
    title: '下划线',
  },
  ToolbarButton: React.memo(({ config }) => {
    const editor = useSlate();

    const active = get(Editor.marks(editor), key);
    return (
      <Tooltip title={config.title}>
        <Button
          type="text"
          style={activeStyle(active)}
          onClick={() => {
            if (active) {
              Editor.removeMark(editor, key);
            } else {
              Editor.addMark(editor, key, true);
            }
          }}
          icon={<UnderlineOutlined />}
        />
      </Tooltip>
    );
  }),
  processLeaf: ({ leaf, style }) => {
    return leaf[key]
      ? { textDecoration: `${style.textDecoration || ''} underline` }
      : {};
  },
};
export default config;
