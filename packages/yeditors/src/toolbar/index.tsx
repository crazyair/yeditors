import { Divider } from 'antd';
import React, { useRef } from 'react';
import { useSlate } from 'slate-react';

import './index.less';

export default React.memo(({ plugins }: any) => {
  const editor = useSlate();
  const ref = useRef<any>(editor.selection);
  if (editor.selection != null) {
    ref.current = editor.selection;
  }
  editor.selection = ref.current;
  return (
    <>
      {plugins.map((item: any, index: string) => {
        if ('isShow' in item && !item.isShow) return null;
        if (item.type === 'line') {
          return <Divider key={index} type="vertical" />;
        }
        const { ToolbarButton, config } = item.props;
        return <ToolbarButton key={index} config={config} />;
      })}
    </>
  );
});
