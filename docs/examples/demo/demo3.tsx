import React, { useState } from 'react';
import { YEditor } from 'yeditors';

const initialValue = [
  {
    type: 'paragraph',
    children: [
      {
        fontSize: '30px',
        text:
          '测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测',
      },
    ],
    textIndent: 2,
  },
];
const data = {
  name: '张三',
  age: '10',
  children: [{ name: '张三', age: '10' }],
};

export default () => {
  const [value, setValue] = useState(initialValue);

  return (
    <div style={{ padding: 20 }}>
      <YEditor value={value} onChange={setValue} dataSource={data} />{' '}
    </div>
  );
};
