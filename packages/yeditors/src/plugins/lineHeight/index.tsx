import { Select, Tooltip } from 'antd';
import { get, map } from 'lodash';
import React from 'react';
import { Editor } from 'slate';
import { useSlate } from 'slate-react';
import { PluginProps } from '..';

const key = 'lineHeight';

const config: PluginProps['props'] = {
  config: {
    list: [1, 1.2, 1.5, 1.75, 2, 2.5, 3, 4],
    title: '行高',
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
          placeholder={title}
          style={{ width: 80 }}
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
