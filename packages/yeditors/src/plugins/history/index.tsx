import React from 'react';
import { useSlate } from 'slate-react';
import { withHistory, HistoryEditor } from 'slate-history';
import { RedoOutlined, UndoOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import { activeStyle } from '../../utils';
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
            style={activeStyle(editor.history.undos.length > 0)}
            onClick={() => {
              HistoryEditor.undo(editor);
            }}
            icon={<UndoOutlined />}
          />
        </Tooltip>
        <Tooltip title={config.title.redo}>
          <Button
            type="text"
            style={activeStyle(editor.history.redos.length > 0)}
            onClick={() => {
              HistoryEditor.redo(editor);
            }}
            icon={<RedoOutlined />}
          />
        </Tooltip>
      </>
    );
  }),
};
export default config;
