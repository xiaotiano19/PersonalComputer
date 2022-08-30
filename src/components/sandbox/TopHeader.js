import React from 'react'
import { useHistory } from 'react-router-dom'
import { useLocation } from 'react-router-dom';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
    HomeOutlined
} from '@ant-design/icons';
import { Layout, Dropdown, Menu, Avatar, Breadcrumb } from 'antd';
import { connect } from 'react-redux'
const { Header } = Layout;

function TopHeader(props) {
    // console.log('本地鉴权', JSON.parse(localStorage.getItem('token')));
    // const [collapsed, setCollspaed] = useState(false);
    const changeCollapsed = () => {
        //改变state的isCollapsed
        // console.log(props)
        props.changeCollapsed()
    }
    const { role: { roleName }, username } = JSON.parse(localStorage.getItem("token"))
    const history = useHistory();
    const location = useLocation();
    // console.log('params', location.pathname);
    const LocalRouterMap = {
        "/home": "首页",
        "/user-manage/list": "用户列表",
        "/right-manage/role/list": "角色列表",
        "/right-manage/right/list": "权限列表",
        "/news-manage/add": "撰写新闻",
        "/news-manage/draft": "草稿箱",
        "/news-manage/category": "新闻分类",
        "/audit-manage/audit": "审核新闻",
        "/audit-manage/list": "审核列表",
        "/publish-manage/unpublished": "待发布",
        "/publish-manage/published": "已发布",
        "/publish-manage/sunset": "已下线"
    }
    const menu = (
        <Menu
            items={[
                {
                    key: '1',
                    label: roleName
                },
                {
                    key: '2',
                    danger: true,
                    label: '退出',
                    onClick: () => {
                        localStorage.removeItem("token") //清除token 
                        // console.log(history)
                        history.replace("/login") // 用useHistory钩子history路由重定向的方法
                    }
                }
            ]}
        />
    )


    return (
        <Header
            className="site-layout-background"
            style={{
                padding: "0 16px",
                height: "70px"
            }}
        >
            {/* 面包屑导航 */}
            <Breadcrumb>
                <Breadcrumb.Item href="#/home">
                    <HomeOutlined />
                </Breadcrumb.Item>
                <Breadcrumb.Item >
                    <UserOutlined />
                    <span>{LocalRouterMap[location.pathname]}</span>
                </Breadcrumb.Item>
            </Breadcrumb>
            {
                props.isCollapsed ? <MenuUnfoldOutlined onClick={changeCollapsed} /> : <MenuFoldOutlined onClick={changeCollapsed} />
            }


            <div style={{ float: "right" }} >
                <span>欢迎<span style={{ color: "#1890ff" }}>{username}</span>回来</span>
                {/* 下拉菜单 */}
                <Dropdown overlay={menu}>
                    {/* 图标插槽 */}
                    <Avatar size="small" style={{ marginRight: "10px" }} src="https://joeschmoe.io/api/v1/random" icon={<UserOutlined />} />
                </Dropdown>
            </div>
        </Header>
    )
}
//connect(
//mapStateToProps 
//mapDispatchToProps
//)(被包装的组件)
const mapStateToProps = ({ CollApsedReducer: { isCollapsed } }) => {
    return {
        isCollapsed
    }
}
const mapDispatchToProps = {
    changeCollapsed() {
        return {
            type: "change_collapsed"
        }//action
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(TopHeader)
