import { Select, Tooltip } from 'antd';
import { get, map } from 'lodash';
import React from 'react';
import { Editor } from 'slate';
import { useSlate } from 'slate-react';
import { PluginProps } from '..';

const key = 'fontSize';

const config: PluginProps['props'] = {
  config: {
    list: [
      12,
      14,
      16,
      18,
      20,
      24,
      28,
      30,
      32,
      36,
      40,
      48,
      56,
      64,
      72,
      96,
      120,
      144,
    ],
    title: '字号',
  },
  ToolbarButton: ({ config }) => {
    const editor = useSlate();

    const { list, title } = config;
    const handleChange = (value: any) => {
      Editor.addMark(editor, key, value);
    };
    return (
      <Tooltip title={title}>
        <Select
          allowClear
          size="small"
          placeholder={title}
          style={{ width: 70 }}
          bordered={false}
          onChange={handleChange}
          value={get(Editor.marks(editor), key)}
        >
          {map(list, value => {
            return (
              <Select.Option key={value} value={value}>
                {value}
              </Select.Option>
            );
          })}
        </Select>
      </Tooltip>
    );
  },
  processLeaf: ({ leaf }) => {
    return leaf[key] ? { [key]: leaf[key] } : {};
  },
};
export default config;
