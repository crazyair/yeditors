import React from 'react';
import { Select } from 'antd';
import { map, includes } from 'lodash';
import { Transforms } from 'slate';
import { useSlate } from 'slate-react';

import { getValue2, PluginProps } from '..';

const key = 'header';

const getHtml = (value: string) => ({ [key]: value, type: 'paragraph' });

const config: PluginProps['props'] = {
  config: {
    block: true,
    title: '标题',
    list: [
      { id: '', name: '正文' },
      { id: 'h1', name: '标题 1' },
      { id: 'h2', name: '标题 2' },
      { id: 'h3', name: '标题 3' },
      { id: 'h4', name: '标题 4' },
      { id: 'h5', name: '标题 5' },
      { id: 'h6', name: '标题 6' },
    ],
  },
  withHtml: () => {
    return {
      H1: () => getHtml('h1'),
      H2: () => getHtml('h2'),
      H3: () => getHtml('h3'),
      H4: () => getHtml('h4'),
      H5: () => getHtml('h5'),
      H6: () => getHtml('h6'),
    };
  },
  ToolbarButton: ({ config }) => {
    const editor = useSlate();
    const { list, title } = config;
    const handleChange = (v: string) => {
      Transforms.setNodes(editor, { [key]: v });
    };
    return (
      <Select
        allowClear
        style={{ width: 100 }}
        placeholder={title}
        bordered={false}
        onChange={handleChange}
        value={(getValue2(editor, key) as string) || ''}
      >
        {map(list, (value, index) => {
          return (
            <Select.Option key={index} value={value.id}>
              {value.name}
            </Select.Option>
          );
        })}
      </Select>
    );
  },
  processElement: ({ element, attributes, children }) => {
    if (element[key] && includes(element[key], 'h')) {
      return React.createElement(`${element[key]}`, attributes, children);
    }
  },
};

export default config;
