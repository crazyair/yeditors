import React, { useState } from 'react';
import { Layout, Menu, Modal, Pagination } from 'antd';
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';

const { Content, Sider } = Layout;

export default (props: any) => {
  const { children } = props;
  const [visible, setVisible] = useState(false);
  const [key, setKey] = useState('1');

  const handleClick = (e: any) => {
    setKey(e.key);
  };
  return (
    <>
      {React.cloneElement(children, {
        onClick: () => {
          setVisible(true);
        },
      })}
      <Modal
        visible={visible}
        onCancel={() => setVisible(false)}
        destroyOnClose
        width={950}
        title="帮助"
        bodyStyle={{ padding: 0 }}
      >
        <Layout>
          <Content style={{ padding: '1px 1px' }}>
            <Layout>
              <Sider className="site-layout-background" width={200}>
                <Menu
                  onClick={handleClick}
                  selectedKeys={[key]}
                  style={{ height: '100%' }}
                  mode="inline"
                >
                  <Menu.Item key="1">占位符使用</Menu.Item>
                  <Menu.Item key="2">占位符使用</Menu.Item>
                </Menu>
              </Sider>
              <Content style={{ padding: '0 24px', minHeight: 280 }}>
                {key === '1' && <div>111</div>}
                <Pagination defaultCurrent={1} total={50} showSizeChanger />
              </Content>
            </Layout>
          </Content>
        </Layout>
      </Modal>
    </>
  );
};
