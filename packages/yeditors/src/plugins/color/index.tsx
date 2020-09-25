import { Select, Tooltip } from 'antd';
import { get, includes, map } from 'lodash';
import React from 'react';
import regHex from 'rgb-hex';
import { Editor } from 'slate';
import { useSlate } from 'slate-react';
import { colors, PluginProps } from '..';

const key = 'color';

const config: PluginProps['props'] = {
  config: {
    list: colors,
    title: '字体颜色',
  },
  withStyle: () => {
    return {
      [key]: (value: string) => {
        return {
          attrs: {
            [key]: includes(value, 'rgb') ? `#${regHex(value)}` : value,
          },
        };
      },
    };
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
              <Select.Option
                title={value}
                style={{ color: value }}
                key={value}
                value={value}
              >
                字体颜色
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
