import React from 'react';
import {
  AlignCenterOutlined,
  AlignLeftOutlined,
  AlignRightOutlined,
  MenuOutlined,
} from '@ant-design/icons';
import { merge } from 'lodash';
import { Transforms } from 'slate';
import { useSlate } from 'slate-react';
import { Button, Tooltip } from 'antd';
import { activeStyle } from '../../utils';
import { getValue2, PluginProps } from '..';

const key = 'textAlign';

const config: PluginProps['props'] = {
  config: {
    title: {
      left: '居左',
      center: '居中',
      right: '居右',
      justify: '两端',
    },
  },
  withStyle: () => {
    return {
      [key]: (value: string) => {
        return {
          attrs: { [key]: value },
        };
      },
    };
  },
  ToolbarButton: React.memo(({ config }) => {
    const editor = useSlate();

    const value = getValue2(editor, key);

    const handleChange = (v: any) => {
      Transforms.setNodes(editor, { [key]: value === v ? undefined : v });
    };

    return (
      <>
        <Tooltip title={config.title.left}>
          <Button
            type="text"
            style={activeStyle(value === 'left')}
            onClick={() => {
              handleChange('left');
            }}
            icon={<AlignLeftOutlined />}
          />
        </Tooltip>
        <Tooltip title={config.title.center}>
          <Button
            type="text"
            style={activeStyle(value === 'center')}
            onClick={() => {
              handleChange('center');
            }}
            icon={<AlignCenterOutlined />}
          />
        </Tooltip>
        <Tooltip title={config.title.right}>
          <Button
            type="text"
            style={activeStyle(value === 'right')}
            onClick={() => {
              handleChange('right');
            }}
            icon={<AlignRightOutlined />}
          />
        </Tooltip>
        <Tooltip title={config.title.justify}>
          <Button
            type="text"
            style={activeStyle(value === 'justify')}
            onClick={() => {
              handleChange('justify');
            }}
            icon={<MenuOutlined />}
          />
        </Tooltip>
      </>
    );
  }),
  processElement: ({ element, attributes, children }) => {
    if (element[key]) {
      merge(attributes, { style: { textAlign: element[key] } });
      return <div {...attributes}>{children}</div>;
    }
  },
};
export default config;
