import React, { useState } from 'react';
import { YEditor } from 'yeditors';

export default () => {
  const [value, setValue] = useState([
    { type: 'paragraph', children: [{ text: '。。。' }] },
  ]);

  return <YEditor value={value} onChange={e => setValue(e)} />;
};
