import { DownOutlined } from '@ant-design/icons';
import { Dropdown } from 'antd';
import { get, includes, map } from 'lodash';
import React, { useState } from 'react';
import regHex from 'rgb-hex';
import { Editor } from 'slate';
import { useSlate } from 'slate-react';
import { colors, PluginProps } from '..';

import './index.less';

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
    const [color, setColor] = useState('');
    const activeColor = get(Editor.marks(editor), key);

    return (
      <>
        <Dropdown.Button
          size="small"
          type="ghost"
          icon={<DownOutlined />}
          title={title}
          placement="bottomCenter"
          overlay={
            <>
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
              </div>
            </>
          }
        >
          <span
            style={{
              borderBottom: `2px solid ${color}`,
              lineHeight: 1,
              width: 12,
            }}
            onClick={() => {
              handleChange(activeColor === color ? undefined : color);
            }}
          >
            A
          </span>
        </Dropdown.Button>
      </>
    );
  },
  processLeaf: ({ leaf }) => {
    return leaf[key] ? { [key]: leaf[key] } : {};
  },
};
export default config;
