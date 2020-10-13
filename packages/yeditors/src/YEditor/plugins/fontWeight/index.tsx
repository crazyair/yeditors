import { BoldOutlined, DownOutlined } from '@ant-design/icons';
import { Button, Dropdown, Tooltip } from 'antd';
import { get, map } from 'lodash';
import React, { useState } from 'react';
import { Editor } from 'slate';
import { useSlate } from 'slate-react';
import { YForm } from 'yforms';

import { PluginProps } from '..';

const key = 'fontWeight';

const config: PluginProps['props'] = {
  config: {
    list: ['bold', 100, 200, 300, 400, 500, 600, 700, 800, 900],
    title: '字体重量',
  },
  withStyle: () => {
    return {
      [key]: (value: string) => {
        return { attrs: { [key]: value } };
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
                    componentProps: { placeholder: `自定义${title}` },
                  },
                ]}
              </YForm>
            </div>
          }
        >
          <Button type="text" size="small">
            {activeValue || <BoldOutlined />}
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
