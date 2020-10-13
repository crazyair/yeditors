import React from 'react';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { merge } from 'lodash';
import { Transforms } from 'slate';
import { useSlate } from 'slate-react';
import { Button, Tooltip } from 'antd';
import { activeStyle } from '../../utils';
import { getValue2, PluginProps } from '../index';

const key = 'textIndent';

const config: PluginProps['props'] = {
  config: {
    title: { increase: '增加缩进', decrease: '减少缩进' },
  },
  withStyle: () => {
    return {
      [key]: (value: string) => {
        return {
          attrs: { [key]: parseInt(value, 10) },
        };
      },
    };
  },
  ToolbarButton: React.memo(({ config }) => {
    const editor = useSlate();

    const handleChange = (v: any) => {
      if (v > 0) {
        Transforms.setNodes(editor, { [key]: v });
      } else {
        Transforms.unsetNodes(editor, [key]);
      }
    };
    const value = parseInt(`${getValue2(editor, key) || '0'}`, 10);
    return (
      <>
        <Tooltip title={config.title.increase}>
          <Button
            type="text"
            style={activeStyle(value > 0)}
            onClick={() => {
              const _value = value + 2;
              if (_value < 100) {
                handleChange(_value);
              }
            }}
            icon={<MenuUnfoldOutlined />}
          />
        </Tooltip>
        <Tooltip title={config.title.decrease}>
          <Button
            type="text"
            disabled={value === 0}
            onClick={() => {
              const _value = value - 2;
              if (_value >= 0) {
                handleChange(_value);
              }
            }}
            icon={<MenuFoldOutlined />}
          />
        </Tooltip>
      </>
    );
  }),
  processElement: ({ element, attributes, children }) => {
    if (element[key]) {
      merge(attributes, { style: { [key]: `${element[key]}em` } });
      return <div {...attributes}>{children}</div>;
    }
  },
};
export default config;
