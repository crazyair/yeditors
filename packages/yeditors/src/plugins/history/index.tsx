import React from 'react';
import { useSlate } from 'slate-react';
import { withHistory, HistoryEditor } from 'slate-history';
import { Button, Tooltip } from 'antd';
import { IconFont } from '../../utils';
import { PluginProps } from '..';

const config: PluginProps['props'] = {
  config: {
    title: {
      undo: '撤销',
      redo: '重做',
    },
  },
  withEditor: editor => {
    return withHistory(editor);
  },
  ToolbarButton: React.memo(({ config }) => {
    // 重新设置类型
    const editor: HistoryEditor = useSlate() as any;
    return (
      <>
        <Tooltip title={config.title.undo}>
          <Button
            type="text"
            disabled={editor.history.undos.length === 0}
            onClick={() => HistoryEditor.undo(editor)}
            icon={<IconFont type="icon-ic_undo" />}
          />
        </Tooltip>
        <Tooltip title={config.title.redo}>
          <Button
            type="text"
            disabled={editor.history.redos.length === 0}
            onClick={() => HistoryEditor.redo(editor)}
            icon={<IconFont type="icon-ic_undo" rotate={180} />}
          />
        </Tooltip>
      </>
    );
  }),
};
export default config;
