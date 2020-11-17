import { DownOutlined, FontSizeOutlined } from '@ant-design/icons';
import { Button, Dropdown, Tooltip } from 'antd';
import { get, map } from 'lodash';
import React, { useState } from 'react';
import { Editor } from 'slate';
import { useSlate } from 'slate-react';
import { YForm } from 'yforms';
import { PluginProps } from '..';

const key = 'fontSize';

const config: PluginProps['props'] = {
  config: {
    list: [
      '12px',
      '14px',
      '16px',
      '18px',
      '20px',
      '24px',
      '28px',
      '30px',
      '32px',
      '36px',
      '40px',
      '48px',
      '56px',
      '64px',
      '72px',
      '96px',
      '120px',
      '144px',
    ],
    title: '字号',
  },
  withStyle: () => {
    return {
      [key]: (value: string) => {
        return {
          attrs: {
            // 过滤默认值 medium
            [key]: value !== 'medium' ? value : undefined,
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
    const activeValue = get(Editor.marks(editor), key);
    const [visible, setVisible] = useState(false);

    return (
      <Tooltip title={title}>
        <Dropdown
          visible={visible}
          onVisibleChange={flag => setVisible(flag)}
          placement="bottomCenter"
          trigger={['click']}
          overlay={
            <div className="select-value">
              {map(list, value => {
                return (
                  <div
                    onClick={() => {
                      handleChange(activeValue === value ? undefined : value);
                    }}
                    key={value}
                    className="tag"
                  >
                    {value}
                  </div>
                );
              })}
              <YForm
                onFinish={values => {
                  handleChange(values.customValue);
                  setVisible(false);
                }}
              >
                {[
                  {
                    noStyle: true,
                    type: 'input',
                    name: 'customValue',
                    componentProps: { placeholder: `自定义${title} 12px/2em` },
                  },
                ]}
              </YForm>
            </div>
          }
        >
          <Button type="text" size="small">
            {activeValue || <FontSizeOutlined />}
            <DownOutlined />
          </Button>
        </Dropdown>
      </Tooltip>
    );
  },
  processLeaf: ({ leaf }) => {
    return leaf[key] ? { [key]: leaf[key] } : {};
  },
};
export default config;
