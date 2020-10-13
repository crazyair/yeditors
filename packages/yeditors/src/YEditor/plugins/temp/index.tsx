import React from 'react';
import { Button, Tooltip } from 'antd';

import { PluginProps } from '..';
import LinkForm from './formItem';
import { IconFont } from '../../utils';

const config: PluginProps['props'] = {
  config: {
    block: true,
    title: '占位符',
  },
  ToolbarButton: React.memo(({ config }) => {
    return (
      <>
        <LinkForm>
          <Tooltip title={config.title}>
            <Button type="text" icon={<IconFont type="icon-zhanweifu" />} />
          </Tooltip>
        </LinkForm>
      </>
    );
  }),
};
export default config;
