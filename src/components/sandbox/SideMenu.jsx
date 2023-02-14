import {
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom'
import axios from 'axios'
import { connect } from 'react-redux'
import './index.css'
const { Sider } = Layout;
const { SubMenu } = Menu;
const iconList = {
    '/home': <UserOutlined />,
    '/user-manage': <VideoCameraOutlined />,
    '/right-manage': <UploadOutlined />,
    '/user-manage/list': <UserOutlined />,
    '/right-manage/role/list': <UserOutlined />,
    '/right-manage/right/list': <UserOutlined />
}
function SideMenu(props) {
    const [menu, setMenu] = useState([])
    const { role: { rights } } = JSON.parse(localStorage.getItem('token'))
    useEffect(() => {
        axios.get('/rights?_embed=children')
            .then(res => { setMenu(res.data) })

    }, [])
    const renderMenu = (menuList) => {
        return menuList.map(item => {
            if (item.pagepermisson && rights.includes(item.key)) {
                if (item.children?.length > 0) {
                    return <SubMenu key={item.key} icon={iconList[item.key]} title={item.title}>
                        {renderMenu(item.children)}
                    </SubMenu>
                }
                return <Menu.Item key={item.key} icon={iconList[item.key]} onClick={() => {
                    props.history.push(item.key)
                }}>{item.title}</Menu.Item>
            }
        })
    }
    const selectKeys = [props.location.pathname]
    const openKeys = ['/' + props.location.pathname.split('/')[1]]
    return (

        <Sider trigger={null} collapsible collapsed={props.isCollapsed}>
            <div style={{ display: 'flex', height: '100vh', flexDirection: 'column' }}>
                <div className="logo" >全球新闻发布管理系统</div>
                <div style={{ flex: 1, overflow: 'auto' }}>
                    <Menu
                        theme="dark"
                        mode="inline"
                        selectedKeys={selectKeys}
                        defaultOpenKeys={openKeys}
                    >
                        {renderMenu(menu)}
                    </Menu>
                </div>
            </div>
        </Sider>
    )
}
const mapStateToProps = ({ CollapsedReducer: { isCollapsed } }) => {
    return {
        isCollapsed
    }
}
export default connect(mapStateToProps)(withRouter(SideMenu))
