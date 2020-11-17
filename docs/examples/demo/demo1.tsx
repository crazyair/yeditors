import React, { useState } from 'react';
import { YEditor } from 'yeditors';

const initialValue = [
  {
    type: 'paragraph',
    children: [
      {
        text: '多层级坑位',
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
  {
    type: 'list',
    props: {
      field: 'children',
    },
    children: [
      {
        type: 'paragraph',
        children: [
          {
            text: '${name}',
          },
        ],
      },
      {
        type: 'list',
        props: {
          field: 'children',
          style: 'margin:0 20px',
        },
        children: [
          {
            type: 'paragraph',
            children: [
              {
                text: '${name}',
              },
            ],
          },
        ],
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
  list: [
    { name: '张三1', age: '101' },
    { name: '张三2', age: '102' },
    { name: '张三3', age: '103' },
  ],
  children: [
    {
      name: '第一层',
      children: [{ name: '第二层', children: [{ name: '第三层' }] }],
    },
  ],
};

export default () => {
  const [value, setValue] = useState(initialValue);
  return (
    <div style={{ padding: 20 }}>
      <YEditor value={value} onChange={setValue} dataSource={data} />{' '}
    </div>
  );
};
