import { Select, Tooltip } from 'antd';
import { get, map } from 'lodash';
import React from 'react';
import { Editor } from 'slate';
import { useSlate } from 'slate-react';
import { PluginProps } from '..';

const key = 'letterSpacing';

const config: PluginProps['props'] = {
  config: {
    list: [0, 1, 2, 3, 4, 5, 6],
    title: '字间距',
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
          style={{ width: 90 }}
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
    return leaf[key] ? { [key]: `${leaf[key]}px` } : {};
  },
};
export default config;
