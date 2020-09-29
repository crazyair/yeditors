import React from 'react';
import { TooltipProps } from 'antd/lib/tooltip';
import { get, includes, split } from 'lodash';
import { Editor } from 'slate';

export interface PluginProps {
  type: string;
  isShow?: boolean;
  props?: {
    config: Object;
    withHtml?: () => any;
    withStyle?: () => any;
    withEditor?: (editor: Editor, plugin: Array<PluginProps>) => any;
    ToolbarButton?: (props: { config: any }) => React.ReactNode;
    processLeaf?: (props: any) => Object;
    processElement?: (props: any) => React.ReactNode;
  };
}

export const colors = [
  '#000000',
  '#333333',
  '#666666',
  '#999999',
  '#cccccc',
  '#61a951',
  '#16a085',
  '#07a9fe',
  '#003ba5',
  '#8e44ad',
  '#f32784',
  '#D22928',
  '#F54236',
  '#c0392b',
  '#d35400',
  '#f39c12',
  '#fdda00',
  '#7f8c8d',
  '#2c3e50',
  '#ffffff',
];

export const getValue = (editor: Editor, key: string) => {
  let current;
  const [match] = Editor.nodes(editor, {
    match: n => includes(`${n.type}`, key),
  });
  if (match && match[0]) {
    current = `${match[0].type}`;
  }
  const value = current && split(current, '-')[1];
  return value;
};
export const getValue2 = (editor: Editor, field: string = 'type') => {
  const [match] = Editor.nodes(editor, {
    match: node => !!node[field],
  });
  return get(match, [0, field]);
};

export const Tooltip = (props: TooltipProps) => {
  console.log('props', props);
  const { children, ...rest } = props;
  return (
    <Tooltip {...rest} placement="bottom">
      {children}
    </Tooltip>
  );
};

const pluginMap: PluginProps[] = [
  { type: 'header', props: require('./headings').default },
  { type: 'line' },
  { type: 'line' },
  { type: 'italic', props: require('./italic').default },
  { type: 'underline', props: require('./underlined').default },
  { type: 'line-through', props: require('./lineThrough').default },
  { type: 'color', props: require('./color').default },
  { type: 'backgroundColor', props: require('./bgColor').default },
  { type: 'line' },
  { type: 'ul', props: require('./ul').default },
  { type: 'ol', props: require('./ol').default },
  { type: 'line' },
  { type: 'indent', props: require('./indent').default },
  { type: 'line' },
  { type: 'textAlign', props: require('./textAlign').default },
  { type: 'line' },
  { type: 'image', props: require('./image').default },
  { type: 'link', props: require('./link').default },
  { type: 'line' },
  { type: 'copyStyle', props: require('./copyStyle').default },
  { type: 'line' },
  { type: 'fontSize', props: require('./fontSize').default },
  { type: 'lineHeight', props: require('./lineHeight').default },
  { type: 'letterSpacing', props: require('./letterSpacing').default },
  { type: 'fontWeight', props: require('./fontWeight').default },
  { type: 'line' },
  { type: 'withHtml', isShow: false, props: require('./withHtml').default },
  // { type: 'temp', props: require('./temp').default },
  { type: 'list', props: require('./list').default },
  { type: 'delete', props: require('./delete').default },
  { type: 'question', props: require('./question').default },
  { type: 'line' },
  { type: 'history', props: require('./history').default },
];

export default pluginMap;
