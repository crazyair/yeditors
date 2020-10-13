import React from 'react';
import { UnorderedListOutlined } from '@ant-design/icons';
import { Transforms } from 'slate';
import { useSlate } from 'slate-react';
import { Button, Tooltip } from 'antd';
import { activeStyle, isBlockActive } from '../../utils';
import { PluginProps } from '..';

const key = 'bulleted-list';

const config: PluginProps['props'] = {
  config: {
    title: '无序列表',
  },
  ToolbarButton: React.memo(({ config }) => {
    const editor = useSlate();

    const active = isBlockActive(editor, key);
    return (
      <Tooltip title={config.title}>
        <Button
          type="text"
          style={activeStyle(active)}
          onClick={() => {
            if (active) {
              Transforms.unwrapNodes(editor, {
                match: n => n.type === key,
                split: true,
              });
              Transforms.setNodes(editor, { type: 'paragraph' });
            } else {
              Transforms.setNodes(editor, { type: 'list-item' });
              Transforms.wrapNodes(editor, { type: key, children: [] });
            }
          }}
          icon={<UnorderedListOutlined />}
        />
      </Tooltip>
    );
  }),
  processElement: ({ element, attributes, children }) => {
    if (element.type === key) {
      return <ul {...attributes}>{children}</ul>;
    }
    if (element.type === 'list-item') {
      return <li {...attributes}>{children}</li>;
    }
  },
};
export default config;
