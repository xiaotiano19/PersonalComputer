import React, { useEffect, useState } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import axios from 'axios'
import NewsAdd from '../../views/sandbox/news-manage/NewsAdd'
import NewsDraft from '../../views/sandbox/news-manage/NewsDraft'
import NewsCategory from '../../views/sandbox/news-manage/NewsCategory'
import NewsUpdate from '../../views/sandbox/news-manage/NewsUpdate'
import NewsPreview from '../../views/sandbox/news-manage/NewsPreview'
import Audit from '../../views/sandbox/audit-manage/Audit'
import AuditList from '../../views/sandbox/audit-manage/AuditList'
import Unpublished from '../../views/sandbox/publish-manage/Unpublished'
import Published from '../../views/sandbox/publish-manage/Published'
import Sunset from '../../views/sandbox/publish-manage/Sunset'
import Home from './../../views/sandbox/home/Home'
import Nopermission from './../../views/sandbox/nopermission/Nopermission'
import RightList from './../../views/sandbox/right-manage/RightList'
import RoleList from './../../views/sandbox/right-manage/RoleList'
import UserList from './../../views/sandbox/user-manage/UserList'
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
export default function NewsRouter() {
    const [BackRouteList, setBackRouteList] = useState([])
    useEffect(() => {
        Promise.all([
            axios.get(`http://localhost:5000/rights`),
            axios.get(`http://localhost:5000/children`)
        ]).then(res => {
            setBackRouteList([...res[0].data,res[1].data])
        })
    }, [])
    return (
        <Switch>
            <Route path='/home' component={Home} />
            <Route path='/user-manage/list' component={UserList} />
            <Route path='/right-manage/role/list' component={RoleList} />
            <Route path='/right-manage/right/list' component={RightList} />
            <Redirect from='/' to='/home' exact />
            <Route path='*' component={Nopermission
            } />
        </Switch>
    )
}
