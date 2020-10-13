import React, { useCallback, useMemo } from 'react';
import { Editable, withReact, Slate } from 'slate-react';
import { createEditor, Editor, Transforms, Path } from 'slate';
import { merge, sortBy } from 'lodash';
import isHotkey from 'is-hotkey';

import './index.less';
import Toolbar from './toolbar';
import pluginMap from './plugins';
import { YEditorContext } from './Context';
import { getText } from './utils';

const initialValue = [{ type: 'paragraph', children: [{ text: '' }] }];

export interface YEditorProps {
  value?: any;
  onChange?: (e: any) => void;
}

const YEditor = (props: YEditorProps) => {
  const { value = initialValue, onChange = () => {} } = props;
  const renderElement = useCallback(
    props => <Element {...props} plugins={pluginMap} />,
    [],
  );
  const renderLeaf = useCallback(
    props => <Leaf {...props} plugins={pluginMap} />,
    [],
  );
  const editor = useMemo(() => {
    let editor = withReact(createEditor());
    pluginMap.forEach((item: any) => {
      if (item.props && item.props.withEditor) {
        editor = item.props.withEditor(editor, pluginMap);
      }
    });
    return editor;
  }, []);

  return (
    <YEditorContext.Provider value={{ editor, plugins: pluginMap }}>
      <Slate editor={editor} value={value} onChange={onChange}>
        <div className="editor-main">
          <Toolbar plugins={pluginMap} />
          <hr />
          <Editable
            className="editor"
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            // 不能设置 placeholder 清空数据再输入中文会崩溃
            // placeholder="Enter some rich text…"
            spellCheck
            autoFocus
            onKeyUp={event => {
              // 编辑器为空
              if (event.key === 'Backspace' && !getText(editor.children)) {
                // 删除所有数据
                Transforms.removeNodes(editor);
                // 初始化编辑器必须有的默认数据
                Transforms.insertNodes(editor, initialValue);
              }
            }}
            onKeyDown={event => {
              if (editor.selection) {
                const selectionPath = Editor.path(editor, editor.selection);

                if (isHotkey('mod+Backspace', event as any)) {
                  Transforms.removeNodes(editor);
                }
                // 上面插入
                if (isHotkey('mod+shift+enter', event as any)) {
                  Transforms.insertNodes(
                    editor,
                    { type: 'paragraph', children: [{ text: '' }] },
                    {
                      at: selectionPath.slice(0, selectionPath.length - 2),
                      select: true,
                    },
                  );
                }
                // 下面插入
                if (isHotkey('mod+enter', event as any)) {
                  Transforms.insertNodes(
                    editor,
                    { type: 'paragraph', children: [{ text: '' }] },
                    {
                      at: Path.next(
                        selectionPath.slice(0, selectionPath.length - 2),
                      ),
                      select: true,
                    },
                  );
                }
              }
            }}
          />
        </div>
      </Slate>
    </YEditorContext.Provider>
  );
};

export const Element = React.memo((props: any) => {
  const { attributes = {}, children, element, plugins } = props;
  let res = <div {...attributes}>{children}</div>;
  // 对于 block 放最后，方便最后集合
  const list = sortBy(
    plugins,
    item => (item.props && item.props.config.block) || false,
  );
  list.forEach((item: any) => {
    if (item.props && item.props.processElement) {
      const { block } = item.props.config;
      const dom = item.props.processElement({ attributes, children, element });
      if (dom) {
        if (block) {
          res = dom;
        } else {
          res = <res.type>{dom}</res.type>;
        }
      }
    }
  });
  return res;
});

export const Leaf = React.memo((props: any) => {
  const { attributes, children, leaf, plugins } = props;
  const style = {};
  plugins.forEach((item: any) => {
    if (item.props && item.props.processLeaf) {
      merge(
        style,
        item.props.processLeaf({ attributes, children, leaf, style }),
      );
    }
  });
  if (leaf.key) {
    attributes.key = leaf.key;
  }
  return (
    <span {...attributes} style={style}>
      {children}
    </span>
  );
});

export default YEditor;
