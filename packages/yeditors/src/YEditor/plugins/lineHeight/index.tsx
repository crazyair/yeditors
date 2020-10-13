import { DownOutlined, LineHeightOutlined } from '@ant-design/icons';
import { Button, Dropdown, Tooltip } from 'antd';
import { get, map } from 'lodash';
import React, { useState } from 'react';
import { Editor } from 'slate';
import { useSlate } from 'slate-react';
import { YForm } from 'yforms';
import { PluginProps } from '..';

const key = 'lineHeight';

const config: PluginProps['props'] = {
  config: {
    list: [1, 1.2, 1.5, 1.75, 2, 2.5, 3, 4],
    title: '行高',
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
          className="mr5"
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
            {activeValue || <LineHeightOutlined />}
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
