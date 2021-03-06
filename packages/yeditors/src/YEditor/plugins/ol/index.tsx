import React from 'react';
import { OrderedListOutlined } from '@ant-design/icons';
import { Transforms } from 'slate';
import { useSlate } from 'slate-react';
import { Button, Tooltip } from 'antd';
import { activeStyle, isBlockActive } from '../../utils';
import { PluginProps } from '..';

const key = 'numbered-list';

const config: PluginProps['props'] = {
  config: {
    title: '有序列表',
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
          icon={<OrderedListOutlined />}
        />
      </Tooltip>
    );
  }),
  processElement: ({ element, attributes, children }) => {
    if (element.type === key) {
      return <ol {...attributes}>{children}</ol>;
    }
    if (element.type === 'list-item') {
      return <li {...attributes}>{children}</li>;
    }
  },
};
export default config;
