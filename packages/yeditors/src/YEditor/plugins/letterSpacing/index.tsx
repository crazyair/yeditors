import { DownOutlined, FontSizeOutlined } from '@ant-design/icons';
import { Button, Dropdown, Tooltip } from 'antd';
import { get, map } from 'lodash';
import React, { useState } from 'react';
import { Editor } from 'slate';
import { useSlate } from 'slate-react';
import { IconFont } from '../../utils';
import { YForm } from 'yforms';
import { PluginProps } from '..';

const key = 'letterSpacing';

const config: PluginProps['props'] = {
  config: {
    list: ['0px', '1px', '2px', '3px', '4px', '5px', '6px'],
    title: '字间距',
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
            {activeValue || <IconFont type="icon-zijianju" />}
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
