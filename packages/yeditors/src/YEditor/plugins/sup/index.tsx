import React from 'react';
import { get } from 'lodash';
import { Editor } from 'slate';
import { useSlate } from 'slate-react';
import { Button, Tooltip } from 'antd';

import { activeStyle, IconFont } from '../../utils';
import { PluginProps } from '..';

const key = 'super';

const config: PluginProps['props'] = {
  config: {
    title: '上标',
  },
  ToolbarButton: React.memo(({ config }) => {
    const editor = useSlate();

    const active = get(Editor.marks(editor), key);
    return (
      <Tooltip title={config.title}>
        <Button
          type="text"
          style={activeStyle(active)}
          onClick={() => {
            if (active) {
              Editor.removeMark(editor, key);
            } else {
              Editor.addMark(editor, key, true);
            }
          }}
          icon={<IconFont type="icon-superscript-2" />}
        />
      </Tooltip>
    );
  }),
  processLeaf: ({ leaf }) => {
    return leaf[key] ? { verticalAlign: key } : {};
  },
};
export default config;
