import React from 'react';
import { QuestionOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';

import { PluginProps } from '..';
import LinkForm from './formItem';

const config: PluginProps['props'] = {
  config: { title: '帮助' },
  ToolbarButton: React.memo(({ config }) => {
    return (
      <>
        <LinkForm>
          <Tooltip title={config.title}>
            <Button type="text" icon={<QuestionOutlined />} />
          </Tooltip>
        </LinkForm>
      </>
    );
  }),
};

export default config;
