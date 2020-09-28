import React from 'react';
import ReactDOMServer from 'react-dom/server';
import produce from 'immer';
import { Editor, Text, Transforms, Range, Node } from 'slate';
import {
  concat,
  forEach,
  get,
  includes,
  isEmpty,
  map,
  merge,
  replace,
  split,
  trim,
} from 'lodash';
import { jsx } from 'slate-hyperscript';
import { createFromIconfontCN } from '@ant-design/icons';

import { Leaf, Element } from './YEditor';
import pluginMap from './plugins';

interface SerializeProps {
  type?: string;
  url?: string;
  attributes?: Object;
  props?: { [key: string]: any };
  children: SerializeProps[];
}

// 样式转 React css
export const styleToObj = (styles: string | null | undefined) => {
  const obj: { [key: string]: any } = {};
  forEach(split(styles, ';'), item => {
    if (item && includes(item, ':')) {
      const index = item.indexOf(':');
      const property = trim(item.substring(0, index));
      const value = trim(item.substring(index + 1));
      const _key = property.replace(/-(\w)/g, (_, value) =>
        value.toUpperCase(),
      );
      obj[_key] = value;
    }
  });
  return obj;
};

export const activeStyle = (is?: boolean) => {
  return { color: is ? '#1890ff' : undefined };
};

export const isTemp = (value?: string) => {
  return /\$\{[^}]+\}/.test(value || '');
};

const replaceMessage = (template: string, kv: any, prevField?: any) => {
  if (!template) return 'no data';
  return template.replace(/\$\{[^}]+\}/g, str => {
    const key = str.slice(2, -1);
    return get(kv, prevField ? concat(prevField, key) : key);
  });
};

// 解析成 html
export const serialize = (nodeData: SerializeProps[], props?: any): string => {
  const { data = {} } = props || {};
  const func = (
    node: SerializeProps,
    parentField?: string,
    parentIndex?: string,
  ): React.ReactElement => {
    let _parentField = parentField;
    let _parentIndex = parentIndex;

    if (Text.isText(node)) {
      let { text } = node;
      if (isTemp(text)) {
        const _name = _parentField
          ? concat(_parentField, _parentIndex)
          : undefined;
        const value = replaceMessage(text, data, _name);
        if (value) {
          text = value;
        }
      }
      return (
        <Leaf plugins={pluginMap} leaf={node} attributes={node.attributes}>
          {text}
        </Leaf>
      );
    }

    const nextState = produce(node, draftState => {
      if (node.type === 'list' && node.props?.field) {
        const dataField = _parentField
          ? concat(_parentField, _parentIndex, node.props?.field)
          : node.props?.field;

        _parentField = dataField;
        const list: any[] = [];

        forEach(get(data, dataField), (_, index) => {
          list.push(
            ...map(draftState.children, item => {
              return { ...item, index };
            }),
          );
        });
        draftState.children = list;
      }
    });

    const children = map(nextState.children, (n: any, index) => {
      if (n.index !== undefined) {
        _parentIndex = n.index;
      }
      return (
        <React.Fragment key={index}>
          {func(n, _parentField, _parentIndex)}
        </React.Fragment>
      );
    });

    if (node.type) {
      // 只有纯粹的空字符串才加换行
      if (node.children.length === 1) {
        const data: any = node.children[0] || {};
        if (data.text === '' && node.type === 'paragraph') {
          return <br />;
        }
      }
      return (
        <Element
          plugins={pluginMap}
          element={node}
          attributes={node.attributes}
        >
          {children}
        </Element>
      );
    }
    return <React.Fragment>{children}</React.Fragment>;
  };
  return ReactDOMServer.renderToStaticMarkup(func({ children: nodeData }));
};

// 获取占位符字段
export const getTempFields = (node: SerializeProps[]) => {
  const data: any[] = [];
  const func = (node: SerializeProps) => {
    if (Text.isText(node)) {
      if (isTemp(node.text)) {
        data.push({ type: 'string', name: replace(node.text, /\{|\}/g, '') });
      }
    }
    map(node.children, n => {
      func(n);
    });
  };
  func({ children: node });
  return data;
};

const ELEMENT_TAGS: any = {
  BLOCKQUOTE: () => ({ type: 'quote' }),
  LI: () => ({ type: 'list-item' }),
  OL: () => ({ type: 'numbered-list' }),
  P: () => ({ type: 'paragraph' }),
  DIV: () => ({ type: 'paragraph' }),
  PRE: () => ({ type: 'code' }),
  UL: () => ({ type: 'bulleted-list' }),
};

export const deserialize = (el: any, keys: any) => {
  const element = el as Element;
  if (element.nodeType === 3) {
    return element.textContent;
  }
  if (element.nodeType !== 1) {
    return null;
  }
  if (element.nodeName === 'BR') {
    return '\n';
  }
  const { nodeName } = element;

  let children: any = Array.from(element.childNodes)
    .map(n => deserialize(n, keys))
    .flat();

  if (element.nodeName === 'BODY') {
    return jsx('fragment', {}, children);
  }

  const _attrs = {};
  const style = styleToObj(element.getAttribute('style'));
  if (!isEmpty(style)) {
    Object.keys(style).forEach(item => {
      if (keys.style[item]) {
        const { attrs } = keys.style[item](style[item]);
        merge(_attrs, attrs);
      }
    });
    children = children.map((child: any) => {
      if (typeof child === 'string') {
        return jsx('text', _attrs, child);
      }
      return jsx('element', _attrs, child);
    });
  }

  if (keys.element[nodeName]) {
    const attrs = keys.element[nodeName](element);
    return jsx('element', { ...attrs, ..._attrs }, children);
  }

  if (ELEMENT_TAGS[nodeName]) {
    const attrs = ELEMENT_TAGS[nodeName](element);
    return jsx('element', attrs, children);
  }

  return children;
};

const LIST_TYPES = ['numbered-list', 'bulleted-list'];

export const isBlockActive = (editor: Editor, format: string) => {
  const [match] = Editor.nodes(editor, {
    match: n => n.type === format,
  });

  return !!match;
};

export const toggleBlock = (editor: Editor, format: string) => {
  const isActive = isBlockActive(editor, format);
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: n => LIST_TYPES.includes(n.type as string),
    split: true,
  });

  Transforms.setNodes(editor, {
    // eslint-disable-next-line no-nested-ternary
    type: isActive ? 'paragraph' : isList ? 'list-item' : format,
  });

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};
export const isMarkActive = (editor: Editor, format: string) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

export const toggleMark = (editor: Editor, format: string) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

export const isLinkActive = (editor: Editor) => {
  const [link] = Editor.nodes(editor, { match: n => n.type === 'link' });
  return !!link;
};

export const unwrapLink = (editor: Editor) => {
  Transforms.unwrapNodes(editor, { match: n => n.type === 'link' });
};

export const wrapLink = (editor: Editor, props: any, text: string) => {
  if (isLinkActive(editor)) {
    unwrapLink(editor);
  }
  const { selection } = editor;
  const isCollapsed = selection && Range.isCollapsed(selection);
  const link = { type: 'link', props, children: isCollapsed ? [{ text }] : [] };
  console.log('link', link);
  console.log('isCollapsed', isCollapsed);
  if (isCollapsed) {
    Transforms.insertNodes(editor, link);
  } else {
    Transforms.wrapNodes(editor, link, { split: true });
    Transforms.collapse(editor, { edge: 'end' });
  }
};

export const editLink = (editor: Editor, props: any, text: string) => {
  const [link] = Editor.nodes(editor, { match: n => n.type === 'link' });
  // 改链接地址
  const { selection } = editor;
  if (selection) {
    const range = merge({}, selection, {
      anchor: { offset: 0 },
      focus: { offset: Node.string(link[0]).length },
    });
    Transforms.select(editor, range);
    Transforms.delete(editor);
    Transforms.setNodes(
      editor,
      { type: 'link', props },
      { match: n => n.type === 'link' },
    );
    Transforms.insertText(editor, text);
  }
};

export const insertLink = (editor: Editor, props: any, text: string) => {
  if (editor.selection) {
    wrapLink(editor, props, text);
  }
};

export const getText = (value: any[]) => {
  return value.map(n => Node.string(n)).join('\n');
};

export const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_2029574_p1qcc36j0bn.js',
});
