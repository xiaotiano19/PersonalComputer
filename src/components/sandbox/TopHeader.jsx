import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined
} from '@ant-design/icons';
import { Layout, Dropdown, Space, Avatar } from 'antd';
import React, { useState } from 'react';
import { withRouter } from 'react-router-dom'
const { Header } = Layout;
function TopHeader(props) {
    const [collapsed, setCollapsed] = useState(false);
    const changeCollapsed = () => {
        setCollapsed(!collapsed)
    }
    const { role: { roleName }, username } = JSON.parse(localStorage.getItem('token'))
    const items = [
        {
            label: (
                <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
                    {roleName}
                </a>
            ),
            key: '0',
        },
        {
            type: 'divider',
        },
        {
            label: '退出',
            key: '1',
            danger: true,
            onClick: () => { localStorage.removeItem('token'); props.history.replace('/login') }
        },
    ];
    return (
        <Header className="site-layout-background" style={{ padding: '0 16px' }}>
            {
                collapsed ? <MenuUnfoldOutlined onClick={changeCollapsed} /> : <MenuFoldOutlined onClick={changeCollapsed} />
            }
            <div style={{ float: "right" }}>
                <span>欢迎<span style={{ color: '#1890FF' }}>{username}</span>回来</span>
                <Dropdown
                    menu={{
                        items,
                    }}
                >
                    <a onClick={(e) => e.preventDefault()}>
                        <Space>
                            <Avatar size="large" icon={<UserOutlined />} />
                        </Space>
                    </a>
                </Dropdown>

            </div>

        </Header>

    )
}
export default withRouter(TopHeader)