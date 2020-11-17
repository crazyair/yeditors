import React from 'react';
import { PictureOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';

import { PluginProps } from '..';
import ImageForm from './formItem';
import { styleToObj } from '../../utils';

const key = 'image';

const config: PluginProps['props'] = {
  config: {
    block: true,
    title: '图片',
  },
  withHtml: () => {
    return {
      IMG: (el: Element) => {
        const attrs = {
          type: key,
          props: {
            // 外部 div 样式
            blockStyle: styleToObj(el.parentElement?.getAttribute('style')),
            // img 参数
            src: el.getAttribute('src'),
            width: el.getAttribute('width'),
            alt: el.getAttribute('alt'),
            style: styleToObj(el.getAttribute('style')),
          },
        };
        return attrs;
      },
    };
  },
  withEditor: editor => {
    const { isVoid } = editor;
    editor.isVoid = (element: any) => {
      return element.type === 'image' ? true : isVoid(element);
    };
    return editor;
  },
  ToolbarButton: React.memo(({ config }) => {
    return (
      <>
        <ImageForm>
          <Tooltip title={config.title}>
            <Button type="text" icon={<PictureOutlined />} />
          </Tooltip>
        </ImageForm>
      </>
    );
  }),
  processElement: ({ element, attributes, children }) => {
    if (element.type === key) {
      const { blockStyle, ...rest } = element.props || {};
      // slate 编辑器场景
      const isEdit = Object.keys(attributes).length > 0;
      if (isEdit) {
        attributes.className = 'image-form';
      }
      return (
        <div {...attributes} style={blockStyle}>
          {isEdit ? (
            <ImageForm initialValues={element.props}>
              <img {...rest} alt="img" />
            </ImageForm>
          ) : (
            <img {...rest} alt="img" />
          )}
          {children}
        </div>
      );
    }
  },
};
export default config;
