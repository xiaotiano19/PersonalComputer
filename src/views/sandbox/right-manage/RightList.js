import React, { useState, useEffect } from 'react'
import { Button, Table, Tag, Modal, Popover, Switch } from 'antd'
import axios from 'axios'
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
const { confirm } = Modal;
export default function RightList() {
    const [dataSource, setdataSource] = useState([])
    useEffect(() => {
        axios.get("/rights?_embed=children").then(res => {
            const list = res.data
            //第一种方案 在删除首页后会造成第二项也没有展开图标问题，所以用forEach list[0].children = ""//把后台第一个数据的children={}项改为"",消除掉权限列表表格中第一个首页带加号问题
            list.forEach(item => {
                if (item.children.length === 0) {
                    item.children = ""
                }
            })
            setdataSource(list)
        }
        )
    }, [])
    const columns = [
        {
            title: 'ID',//第一列
            dataIndex: 'id',//dataIndex对应dataSource中ID map遍历数据到表格第一列ID列
            render: (id) => {//render属性是自定义样式
                return <b>{id}</b>
            }
        },
        {
            title: '权限名称',//第二列
            dataIndex: 'title'
        },
        {
            title: '权限路径',//第三列
            dataIndex: 'key',
            render: (key) => { //给pathname用<Tag></Tag>添加样式
                return <Tag color="orange">{key}</Tag>
            }
        },
        {
            title: '操作',//第四列
            render: (item) => {
                return <div>
                    <Button danger shape="circle" icon={<DeleteOutlined />}
                        onClick={() => confirmMethod(item)} />
                    {/* 气泡卡片 */}
                    <Popover content={<div style={{ textAlign: "center" }}><Switch checked={item.pagepermisson} onChange={() => switchMethod(item)
                    }></Switch></div>} title="页面配置项" trigger={item.pagepermisson === undefined ? "" : "click"}>
                        <Button type="primary" shape="circle" icon={<EditOutlined />} disabled={item.pagepermisson === undefined} />
                        {/* 没有pagepagamisson就禁用编辑 */}
                    </Popover>
                </div>
            }
        },
    ];
    const switchMethod = (item) => {
        item.pagepermisson = item.pagepermisson === 1 ? 0 : 1//通过item.pagepagemisson值开关按钮
        console.log(item)
        setdataSource([...dataSource])//前端页面重新更新（浅拷贝）
        //后端页面更新
        if (item.grade === 1) {
            axios.patch(`/rights/${item.id}`, {
                pagepermisson: item.pagepermisson
            })//patch 是补丁更新
        } else {
            axios.patch(`/children/${item.id}`, {
                pagepermisson: item.pagepermisson
            })
        }

    }
    //删除弹窗事件
    const confirmMethod = (item) => {
        confirm({ //点击删除弹出确认框
            title: '你确定要删除?',
            icon: <ExclamationCircleOutlined />,
            // content: 'Some descriptions',
            onOk() {
                // console.log('OK');
                deleteMethod(item);
            },

            onCancel() {
                // console.log('Cancel');
            },
        })
    }
    //删除方法
    const deleteMethod = (item) => {//通过37行传入的item形参，达到点击操作即能获得当前点击按钮的id功能
        console.log(item)
        //当前页面同步状态+后端同步
        if (item.grade === 1) {//判断是第一层级
            //1.前端删除
            setdataSource(dataSource.filter(data => data.id !== item.id)) //把dataSource中的数据与点击的item相比,不相等就过滤出来，相等就不过滤，即为删除，引发重新render
            //2.后端删除
            axios.delete(`/rights/${item.id}`).then(res => {
            })
        } else {
            let list = dataSource.filter(data => data.id === item.rightId)//找到上一级
            list[0].children = list[0].children.filter(data => data.id !== item.id)//找到二级并过滤删除
            setdataSource([...dataSource])  //需要返回新数组 重新页面刷新
            axios.delete(`/children/${item.id}`)
        }

    }
    return (
        <div>
            <Table dataSource={dataSource} columns={columns}
                pagination={{
                    pageSize: 5//分页器 也是一个组件
                }}
            />;
        </div>
    )
}
