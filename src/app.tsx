import React from 'react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';

export function rootContainer(container: React.Component) {
  return <ConfigProvider locale={zhCN}>{container}</ConfigProvider>;
}
