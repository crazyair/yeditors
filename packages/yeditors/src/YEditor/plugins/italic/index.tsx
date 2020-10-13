import React from 'react';
import { ItalicOutlined } from '@ant-design/icons';
import { get } from 'lodash';
import { Editor } from 'slate';
import { useSlate } from 'slate-react';
import { Button, Tooltip } from 'antd';
import { activeStyle } from '../../utils';
import { PluginProps } from '..';

const key = 'italic';

const config: PluginProps['props'] = {
  config: {
    title: '斜体',
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
          icon={<ItalicOutlined />}
        />
      </Tooltip>
    );
  }),
  processLeaf: ({ leaf }) => {
    return leaf[key] ? { fontStyle: key } : {};
  },
};
export default config;
