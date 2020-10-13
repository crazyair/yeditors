import React from 'react';
import { Transforms } from 'slate';
import { useSlate } from 'slate-react';
import { Button, Tooltip } from 'antd';
import { PluginProps } from '..';

import { IconFont } from '../../utils';

const config: PluginProps['props'] = {
  config: {
    title: '删除行',
  },
  ToolbarButton: React.memo(({ config }) => {
    // 重新设置类型
    const editor = useSlate();
    return (
      <>
        <Tooltip title={config.title}>
          <Button
            type="text"
            onClick={() => {
              Transforms.removeNodes(editor);
            }}
            icon={<IconFont type="icon-shanchuhang" />}
          />
        </Tooltip>
      </>
    );
  }),
};
export default config;
