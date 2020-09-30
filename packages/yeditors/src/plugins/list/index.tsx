import React, { HTMLAttributes, useState } from 'react';
import { Button, Tooltip } from 'antd';
import { get } from 'lodash';
import { Editor } from 'slate';
import { useSlate } from 'slate-react';
import { BlockOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';

import { PluginProps } from '..';
import LinkForm from './formItem';
import { activeStyle, styleToObj } from '../../utils';

import './index.less';

const key = 'list';

const PlusRender = React.memo(() => {
  const editor = useSlate();

  const match = Editor.above(editor, {
    match: n => n.type === key,
  });
  const isActive = !!match;
  return (
    <>
      <LinkForm>
        <Tooltip title="添加块">
          <Button type="text" icon={<PlusOutlined />}>
            添加块
          </Button>
        </Tooltip>
      </LinkForm>
      <LinkForm initialValues={get(match, [0, 'props'])} disabled={!isActive}>
        <Tooltip title="编辑块">
          <Button
            icon={<EditOutlined />}
            disabled={!isActive}
            style={activeStyle(isActive)}
            type="text"
          >
            编辑块
          </Button>
        </Tooltip>
      </LinkForm>
    </>
  );
});

const config: PluginProps['props'] = {
  config: {
    block: true,
    title: '块操作',
  },
  ToolbarButton: React.memo(({ config, plusRender }) => {
    const [isClick, setIsClick] = useState(false);
    return (
      <>
        <Tooltip title={config.title}>
          <Button
            onClick={() => {
              plusRender(isClick ? undefined : <PlusRender />);
              setIsClick(c => !c);
            }}
            type="text"
            icon={<BlockOutlined />}
          />
        </Tooltip>
      </>
    );
  }),
  processElement: ({ element, attributes, children }) => {
    if (element.type === key) {
      const { style } = element.props || {};
      const attr: HTMLAttributes<any> = { style: styleToObj(style) };
      const isEditor = Object.keys(attributes).length > 0;
      if (isEditor) {
        attr.className = 'list';
      }
      return (
        <div {...attr} data-type={key}>
          {isEditor ? <span className="content">{children}</span> : children}
        </div>
      );
    }
  },
};
export default config;
