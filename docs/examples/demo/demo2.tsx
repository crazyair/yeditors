import React from 'react';
import Base from './base';

const initialValue = [
  {
    type: 'paragraph',
    children: [
      {
        text: '',
      },
    ],
  },
  {
    type: 'list',
    props: {
      field: 'children',
      style: 'color:red;\n',
    },
    children: [
      {
        type: 'paragraph',
        children: [
          {
            text: '${name}',
            color: '#F54236',
          },
        ],
        textIndent: 2,
      },
    ],
  },
  {
    type: 'list',
    props: {
      field: 'children',
      style: 'color:red;\n',
    },
    children: [
      {
        type: 'paragraph',
        children: [
          {
            text: '${age}',
            color: '#f39c12',
          },
        ],
        textIndent: 4,
      },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text: '',
      },
    ],
  },
];
const data = {
  name: '张三',
  age: '10',
  children: [{ name: '张三', age: '10' }],
};
export default () => {
  return <Base initialValue={initialValue} data={data} />;
};
