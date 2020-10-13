import { forEach, includes, merge } from 'lodash';
/* eslint-disable prefer-destructuring */
// import React, { useState } from 'react';
import { Editor, Transforms } from 'slate';
import { deserialize } from '../../utils';

import { PluginProps } from '../index';

const withHtml = (editor: Editor, plugins: PluginProps[]) => {
  const { insertData } = editor;
  const keys = {
    element: {},
    style: {},
  };
  plugins.forEach(item => {
    if (item.props) {
      if (item.props.withHtml) {
        merge(keys.element, item.props.withHtml());
      }
      if (item.props.withStyle) {
        merge(keys.style, item.props.withStyle());
      }
    }
  });
  editor.insertData = (data: DataTransfer) => {
    const html = data.getData('text/html');

    if (html) {
      const parsed = new DOMParser().parseFromString(html, 'text/html');
      // 判断是否复制编辑器的内容
      let isEditor = false;
      forEach(parsed.body.childNodes, children => {
        const el = children as Element;
        // 取前几个就行了
        forEach(el.getAttributeNames().slice(0, 3), name => {
          if (includes(name, 'data-slate')) {
            isEditor = true;
          }
        });
      });
      if (!isEditor) {
        const fragment = deserialize(parsed.body, keys);
        Transforms.insertFragment(editor, fragment);
        return;
      }
    }
    if (typeof insertData === 'function') {
      insertData(data);
    }
  };

  return editor;
};

const config: PluginProps['props'] = {
  config: {
    title: { copy: '复制样式', use: '使用样式' },
  },
  withEditor: (editor, plugins) => {
    return withHtml(editor, plugins);
  },
};
export default config;
