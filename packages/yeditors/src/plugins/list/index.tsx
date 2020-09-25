import React from 'react';
import { Button, Tooltip } from 'antd';
import { Editor } from 'slate';
import { useSlate } from 'slate-react';
import { get } from 'lodash';

import { PluginProps } from '..';
import LinkForm from './formItem';
import { activeStyle, styleToObj } from '../../utils';

const key = 'list';

export const isTemp = (value?: string) => {
  return /^\{.+\}$/.test(value || '');
};

const config: PluginProps['props'] = {
  config: {
    block: true,
    title: '多条数据',
  },
  ToolbarButton: React.memo(({ config }) => {
    const editor = useSlate();

    const match = Editor.above(editor, {
      match: n => n.type === key,
    });
    const init = get(match, [0, 'props']);
    return (
      <>
        <LinkForm>
          <Tooltip title={config.title}>
            <Button type="text">新建块</Button>
          </Tooltip>
        </LinkForm>
        <LinkForm initialValues={init}>
          <Tooltip title={config.title}>
            <Button disabled={!init} style={activeStyle(!!init)} type="text">
              编辑块
            </Button>
          </Tooltip>
        </LinkForm>
      </>
    );
  }),
  processElement: ({ element, attributes, children }) => {
    if (element.type === key) {
      const { style } = element.props || {};
      const attr = { style: styleToObj(style) };
      return (
        <>
          {Object.keys(attributes).length > 0 ? (
            <div className="list" {...attr}>
              <span className="content">{children}</span>
            </div>
          ) : (
            <div {...attr} data-type={key}>
              {children}
            </div>
          )}
        </>
      );
    }
  },
};
export default config;
