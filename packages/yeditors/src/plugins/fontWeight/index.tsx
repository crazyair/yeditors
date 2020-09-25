import { Select, Tooltip } from 'antd';
import { get, map } from 'lodash';
import React from 'react';
import { Editor } from 'slate';
import { useSlate } from 'slate-react';
import { PluginProps } from '..';

const key = 'fontWeight';

const config: PluginProps['props'] = {
  config: {
    list: ['bold', 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000],
    title: '字体重量',
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
          style={{ width: 100 }}
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
