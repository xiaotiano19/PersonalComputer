import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import {
    HomeOutlined,
    SolutionOutlined,
    UserOutlined,
    UnlockOutlined,
    TeamOutlined,
    KeyOutlined,
    MailOutlined,
    FormOutlined,
    AlignLeftOutlined,
    RadarChartOutlined,
    AuditOutlined,
    HighlightOutlined,
    OrderedListOutlined,
    ExclamationCircleOutlined,
    SnippetsOutlined,
    CheckCircleOutlined,
    StopOutlined,

} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import './index.css'
import { createHashHistory } from 'history'//导入createHashHistory这个包可以使用history对象
import axios from 'axios';
import { connect } from 'react-redux'
const { Sider } = Layout;
const iconList = {
    "/home": <HomeOutlined />,
    "/user-manage": <SolutionOutlined />,
    "/user-manage/list": <UserOutlined />,
    "/right-manage": <UnlockOutlined />,
    "/right-manage/role/list": <TeamOutlined />,
    "/right-manage/right/list": <KeyOutlined />,
    "/news-manage": <MailOutlined />,
    "/news-manage/add": <FormOutlined />,
    "/news-manage/draft": <AlignLeftOutlined />,
    "/news-manage/category": <RadarChartOutlined />,
    "/audit-manage": <AuditOutlined />,
    "/audit-manage/audit": <HighlightOutlined />,
    "/audit-manage/list": <OrderedListOutlined />,
    "/publish-manage": <SnippetsOutlined />,
    "/publish-manage/unpublished": <ExclamationCircleOutlined />,
    "/publish-manage/published": <CheckCircleOutlined />,
    "/publish-manage/sunset": <StopOutlined />
}

function getItem(label, key, icon, children, type) {
    const { role: { rights } } = JSON.parse(localStorage.getItem("token"))
    //判断
    if (type && rights.includes(key)) {//有pagepermisson才会遍历children  //&&rights.includes(key)是当前登录的用户的权限列表
        // console.log("type", type)
        let childrens = []
        if (children && children.length) {
            children.forEach(res => {
                childrens.push(getItem(res.title, res.key, iconList[res.key], res.children, res.pagepermisson))
            })
        }
        return {
            key,
            icon,
            children: childrens.length ? childrens : undefined,
            label
        };
    } else {
        return
    }
}
const SideMenu = (props) => {
    const [menu, setMenu] = useState([])
    const location = useLocation();//用useLocation或者useHistory钩子函数实现props.location.path.name等价功能  获得props用withrouter包裹获得三大属性：location/match/history
    useEffect(() => {
        axios.get("/rights?_embed=children").then(res => {
            // console.log(res.data)
            let menuList = res.data.map((item) => { return getItem(item.title, item.key, iconList[item.key], item.children, item.pagepermisson) })//接收回来的数据时一个数组,map遍历
            setMenu(menuList)
        })
    }, [])
    const selectKeys = [location.pathname]//用于默认高亮
    const openKeys = ["/" + location.pathname.split("/")[1]]//用于默认open
    const history = createHashHistory();//可以直接实现history.Api跳转
    return (
        //sider为侧边栏 collapsible为是否可收起，默认false collapsed是否可收起，通过控制collapsed控制菜单收缩。
        <Sider trigger={null} collapsible collapsed={props.isCollapsed}>
            {/* 弹性盒布局 */}
            <div style={{ display: "flex", height: "100%", flexDirection: "column" }}>
                <div className="logo" >全球新闻发布管理系统</div>
                {/* 滚动条 */}
                <div style={{ flex: 1, "overflow": "auto" }}>
                    <Menu
                        theme="dark"
                        mode="inline"
                        selectedKeys={selectKeys}
                        // defaultSelectedKeys={selectKeys} //默认哪个key值高亮
                        defaultOpenKeys={openKeys}//默认哪个key默认打开
                        items={menu}
                        onClick={(e) => {
                            // console.log('click ', e.key);
                            history.push(e.key) //路由动态跳转
                        }}
                    />
                </div>
            </div>
        </Sider>
    )
}
const mapStateToProps = ({ CollApsedReducer: { isCollapsed } }) => {
    return {
        isCollapsed
    }
}

export default connect(mapStateToProps)(SideMenu);