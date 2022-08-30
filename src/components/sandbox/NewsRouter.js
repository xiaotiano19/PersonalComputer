import React, { useEffect, useState } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { Spin } from 'antd'
import { connect } from 'react-redux'
import Home from '../../views/sandbox/home/Home'
import UserList from '../../views/sandbox/user-manage/UserList'
import RightList from '../../views/sandbox/right-manage/RightList'
import RoleList from '../../views/sandbox/right-manage/RoleList'
import NoPermission from '../../views/sandbox/nopermission/NoPermission'
import NewsAdd from '../../views/sandbox/news-manage/NewsAdd'
import NewsDraft from '../../views/sandbox/news-manage/NewsDraft'
import NewsCategory from '../../views/sandbox/news-manage/NewsCategory'
import Audit from '../../views/sandbox/audit-manage/Audit'
import AuditList from '../../views/sandbox/audit-manage/AuditList'
import Unpublished from '../../views/sandbox/publish-manage/Unpublished'
import Published from '../../views/sandbox/publish-manage/Published'
import Sunset from '../../views/sandbox/publish-manage/Sunset'
import axios from 'axios'
import NewsPreview from '../../views/sandbox/news-manage/NewsPreview'
import NewsUpdate from '../../views/sandbox/news-manage/NewsUpdate'
// 解决  路由表,通过后端返回数据给用户加载路由,解决了即便用户看不到显示页面,也仍然能通过路由跳转对应页面
const LocalRouterMap = {
    "/home": Home,
    "/user-manage/list": UserList,
    "/right-manage/role/list": RoleList,
    "/right-manage/right/list": RightList,
    "/news-manage/add": NewsAdd,
    "/news-manage/draft": NewsDraft,
    "/news-manage/category": NewsCategory,
    "/news-manage/update/:id": NewsUpdate,//点击更新按钮调整到的路由
    "/news-manage/preview/:id": NewsPreview,//点击草稿箱新闻标题跳转到的路由
    "/audit-manage/audit": Audit,
    "/audit-manage/list": AuditList,
    "/publish-manage/unpublished": Unpublished,
    "/publish-manage/published": Published,
    "/publish-manage/sunset": Sunset
}
function NewsRouter(props) {
    const [BackRouteList, setBackRouteList] = useState([])
    useEffect(() => {  //并发请求2个数据回来后合并到一起 相当于数组扁平化
        Promise.all([
            axios.get(`/rights`),
            axios.get(`/children`),
        ]).then(res => {
            // console.log(res)
            setBackRouteList([...res[0].data, ...res[1].data])

            // console.log([...res[0].data, ...res[1].data])
        })
    }, [])

    // 判断在权限列表中是否开启该权限  决定页面是否能通过路由进入
    const checkRoute = (item) => {
        return LocalRouterMap[item.key] &&
            // pagepermisson 开关是否开启可以登录    routepermisson     是否可以检查草稿箱详情页面  
            (item.pagepermisson || item.routepermisson)
    }
    // 判断当前登录用户权限
    const { role: { rights } } = JSON.parse(localStorage.getItem("token"))
    const checkUserPermission = (item) => {
        //判断当前登录用户权限列表是否包含item.key这条路由路径
        return rights.includes(item.key)
    }
    return (
        <Spin size="large" spinning={props.isLoading}>
            <Switch>
                {
                    BackRouteList.map(item => {
                        // 判断是否有权限进入这条路由
                        if (checkRoute(item) && checkUserPermission(item)) {
                            return <Route path={item.key} key={item.key}
                                component={LocalRouterMap[item.key]} exact
                            // 避免路由模糊匹配,二级路由路径一致
                            />
                        }
                        // 为空自动匹配默认路径
                        return null
                    }
                    )
                }

                <Redirect from="/" to="/home" exact />
                {/* 路由长度大于0渲染403页面 */}
                {
                    BackRouteList.length > 0 && <Route path="*" component={NoPermission} />
                }
            </Switch>
        </Spin>
    )
}
const mapStateToProps = ({ LoadingReducer: { isLoading } }) => {
    return {
        isLoading
    }
}
export default connect(mapStateToProps)(NewsRouter)
