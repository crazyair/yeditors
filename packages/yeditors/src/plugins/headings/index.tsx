import React from 'react';
// import { useSlate } from 'slate-react';
import { Select, Tooltip } from 'antd';
import { map } from 'lodash';
import { Transforms } from 'slate';
import { useSlate } from 'slate-react';

import { getValue2, PluginProps } from '..';

const key = 'header';

const config: PluginProps['props'] = {
  config: {
    block: true,
    title: '标题',
    list: ['1', '2', '3', '4', '5', '6'],
  },
  withHtml: () => {
    return {
      H1: () => {
        const attrs = {
          type: 'paragraph',
          [key]: '1',
        };
        return attrs;
      },
      H2: () => {
        const attrs = { [key]: '2', type: 'paragraph' };
        return attrs;
      },
      H3: () => {
        const attrs = { [key]: '3', type: 'paragraph' };
        return attrs;
      },
    };
  },
  ToolbarButton: ({ config }) => {
    const editor = useSlate();
    const { list, title } = config;
    const handleChange = (v: string) => {
      Transforms.setNodes(editor, { [key]: v });
    };
    return (
      <Tooltip title={title}>
        <Select
          allowClear
          style={{ width: 80 }}
          placeholder={title}
          bordered={false}
          onChange={handleChange}
          value={getValue2(editor, key) as string}
        >
          {map(list, value => {
            return (
              <Select.Option key={value} value={value}>
                标题{value}
              </Select.Option>
            );
          })}
        </Select>
      </Tooltip>
    );
  },
  processElement: ({ element, attributes, children }) => {
    if (element[key]) {
      return React.createElement(`h${element[key]}`, attributes, children);
    }
  },
};

export default config;
