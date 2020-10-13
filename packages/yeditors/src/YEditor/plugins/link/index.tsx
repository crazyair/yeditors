import React from 'react';
import isUrl from 'is-url';
import { LinkOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';

import { PluginProps } from '..';
import LinkForm from './formItem';
import { wrapLink } from '../../utils';

const key = 'link';

const config: PluginProps['props'] = {
  config: {
    block: true,
    title: '链接',
  },
  withHtml: () => {
    return {
      A: (el: Element) => {
        const attrs = {
          type: key,
          props: {
            href: el.getAttribute('href') || undefined,
            target: el.getAttribute('target') || undefined,
          },
        };
        return attrs;
      },
    };
  },
  withEditor: editor => {
    const { insertData, isInline } = editor;

    editor.isInline = element => {
      return element.type === 'link' ? true : isInline(element);
    };

    editor.insertData = (data: DataTransfer) => {
      const text = data.getData('text/plain');
      if (text && isUrl(text)) {
        wrapLink(editor, { href: text }, text);
      } else {
        if (typeof insertData === 'function') {
          insertData(data);
        }
      }
    };

    return editor;
  },
  ToolbarButton: React.memo(({ config }) => {
    return (
      <>
        <LinkForm>
          <Tooltip title={config.title}>
            <Button type="text" icon={<LinkOutlined />} />
          </Tooltip>
        </LinkForm>
      </>
    );
  }),
  processElement: ({ element, attributes, children }) => {
    if (element.type === key) {
      return (
        <>
          {/* slate 编辑器场景 */}
          {Object.keys(attributes).length > 0 ? (
            <LinkForm
              initialValues={{
                ...element.props,
                text: element.children[0].text,
              }}
            >
              <a {...attributes} {...element.props}>
                {children}
              </a>
            </LinkForm>
          ) : (
            <a {...attributes} {...element.props}>
              {children}
            </a>
          )}
        </>
      );
    }
  },
};
export default config;
