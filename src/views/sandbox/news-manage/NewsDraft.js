import React, { useState, useEffect } from 'react'
import { Button, Table, Modal, notification } from 'antd'
import axios from 'axios'
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined, UploadOutlined } from '@ant-design/icons'
const { confirm } = Modal;
export default function NewsDraft(props) {
    const [dataSource, setdataSource] = useState([])
    const { username } = JSON.parse(localStorage.getItem("token"))
    useEffect(() => {
        axios.get(`/news?author=${username}&auditState=0&_expand=category`).then(res => {
            const list = res.data
            setdataSource(list)
        }
        )
    }, [username])
    const columns = [
        {
            title: 'ID',//第一列
            dataIndex: 'id',//dataIndex对应dataSource中ID map遍历数据到表格第一列ID列
            render: (id) => {//render属性是自定义样式
                return <b>{id}</b>
            }
        },
        {
            title: '新闻标题',//第二列
            dataIndex: 'title',
            render: (title, item) => {
                return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>//点击标题跳转子路由
            }
        },
        {
            title: '作者',
            dataIndex: 'author'

        },
        {
            title: '分类',
            dataIndex: 'category',
            render: (category) => {//不能把对象显示在页面中 所以把对象结构
                return category?.title  //会报没有title属性警告 加一个?
            }
        },

        {
            title: '操作',
            render: (item) => {
                return <div>
                    <Button danger shape="circle" icon={<DeleteOutlined />}
                        onClick={() => confirmMethod(item)} />
                    <Button shape="circle" icon={<EditOutlined />}
                        onClick={() => {
                            props.history.push(`/news-manage/update/${item.id}`)
                        }}//点击跳转路由更新
                    />
                    <Button type="primary" shape="circle" icon={<UploadOutlined />} onClick={() => handleCheck(item.id)} />
                    {/* 点击这个上传按钮直接将auditState状态由0变为1即可完成提交审核功能 */}
                </div>
            }
        },
    ];
    const handleCheck = (id) => {
        axios.patch(`/news/${id}`, {
            auditState: 1
        }).then(res => {
            props.history.push(`/audit-manage/list`)//根据auditstate的值判断去草稿箱还是审核
            notification.info({
                message: `通知`,
                description:
                    `您可以到${'审核列表'}中查看您的新闻`,
                placement: "bottomRight",
            });
        })
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
    const deleteMethod = (item) => {
        // console.log(item)
        //     //1.前端删除
        setdataSource(dataSource.filter(data => data.id !== item.id)) //把dataSource中的数据与点击的item相比,不相等就过滤出来，相等就不过滤，即为删除，引发重新render
        //     //2.后端删除
        axios.delete(`/news/${item.id}`)
    }
    return (
        <div>
            <Table dataSource={dataSource} columns={columns}
                pagination={{
                    pageSize: 5//分页器 也是一个组件
                }}
                rowKey={item => item.id}//解决相同key值警告问题
            />
        </div>
    )
}

