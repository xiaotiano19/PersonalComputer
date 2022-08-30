import React, { useEffect } from 'react'
import SideMenu from '../../components/sandbox/SideMenu'
import TopHeader from '../../components/sandbox/TopHeader'
import './NewsSandBox.css'
import { Layout } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import NewsRouter from '../../components/sandbox/NewsRouter'
import NProgress from 'nprogress' //这是一个路由加载进度条
import 'nprogress/nprogress.css'//css
export default function NewsSandBox() {
    NProgress.start()//进度条开始
    useEffect(() => {
        NProgress.done()//进度条结束
    })

    return (
        <Layout>
            <SideMenu ></SideMenu>
            <Layout className="site-layout">
                <TopHeader  ></TopHeader>
                <Content
                    className="site-layout-background"
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        overflow: "auto"//超过高度在自动出滚动条
                    }}
                >
                    <NewsRouter></NewsRouter>
                </Content>
            </Layout>
        </Layout>
    )
}
