import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined
} from '@ant-design/icons';
import { Layout, Dropdown, Space, Avatar } from 'antd';
import React from 'react';
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { changeCollapsed } from '../../redux/actions'
const { Header } = Layout;
function TopHeader(props) {
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
                props.isCollapsed ? <MenuUnfoldOutlined onClick={ props.changeCollapsed} /> : <MenuFoldOutlined onClick={ props.changeCollapsed} />
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
const mapStateToProps = ({ CollapsedReducer: { isCollapsed } }) => {
    return {
        isCollapsed
    }
}
export default connect(mapStateToProps, { changeCollapsed })(withRouter(TopHeader))