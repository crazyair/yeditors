import { BgColorsOutlined, DownOutlined } from '@ant-design/icons';
import { Dropdown } from 'antd';
import { get, includes, map } from 'lodash';
import React, { useState } from 'react';
import regHex from 'rgb-hex';
import { Editor } from 'slate';
import { useSlate } from 'slate-react';
import { YForm } from 'yforms';
import { colors, PluginProps } from '..';

import '../color/index.less';

const key = 'backgroundColor';

const config: PluginProps['props'] = {
  config: {
    list: colors,
    title: '背景颜色',
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
    const [color, setColor] = useState('');
    const activeColor = get(Editor.marks(editor), key);
    const [visible, setVisible] = useState(false);

    return (
      <>
        <Dropdown.Button
          size="small"
          visible={visible}
          onVisibleChange={flag => setVisible(flag)}
          icon={<DownOutlined />}
          title={title}
          style={{ padding: '0 5px 0 0' }}
          placement="bottomCenter"
          overlay={
            <div className="color">
              {map(list, value => {
                return (
                  <div
                    onClick={() => {
                      setColor(value);
                      handleChange(activeColor === value ? undefined : value);
                    }}
                    key={value}
                    className="tag"
                    style={{ backgroundColor: value }}
                  >
                    &nbsp;
                  </div>
                );
              })}
              <YForm
                onFinish={values => {
                  handleChange(values.color);
                  setColor(values.color);
                  setVisible(false);
                }}
              >
                {[
                  {
                    noStyle: true,
                    type: 'input',
                    name: 'color',
                    componentProps: { placeholder: '自定义颜色 #ccc/red' },
                  },
                ]}
              </YForm>
            </div>
          }
        >
          <BgColorsOutlined
            onClick={() =>
              handleChange(activeColor === color ? undefined : color)
            }
            style={{ color }}
          />
        </Dropdown.Button>
      </>
    );
  },
  processLeaf: ({ leaf }) => {
    return leaf[key] ? { [key]: leaf[key] } : {};
  },
};
export default config;
