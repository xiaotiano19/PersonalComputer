import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Table, Tag, Button, Modal, Popover, Switch } from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
export default function RightList() {
    const [dataSource, setDataSource] = useState([])
    useEffect(() => {
        axios.get('http://localhost:5000/rights?_embed=children').then(res => {
            const list = res.data;
            list.forEach(item => {
                if (item.children.length === 0) {
                    item.children = ''
                }
            })
            setDataSource(list)
        })
    }, [])
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: (id) => {
                return <b>{id}</b>
            }
        },
        {
            title: '权限名称',
            dataIndex: 'title'

        },
        {
            title: '权限路径',
            dataIndex: 'key',
            render: (key) => {
                return <Tag color="orange">{key}</Tag>
            }
        },
        {
            title: '操作',
            render: (item) => {
                return (
                    <div >
                        <Button shape="circle" danger icon={<DeleteOutlined />} onClick={() => { confirmMethod(item) }}></Button>
                        <Popover content={
                            <div style={{ textAlign: 'center' }}>
                                <Switch checked={item.pagepermisson} onChange={() => { switchMethod(item) }} />
                            </div>
                        } title="Title" trigger={item.pagepermisson === undefined ? "" : 'click'}>
                            <Button shape="circle" type='primary' icon={<EditOutlined />} disabled={item.pagepermisson === undefined}></Button>
                        </Popover>
                    </div >)
            }
        }
    ]
    const confirmMethod = (item) => {
        Modal.confirm({
            title: '你确定要删除吗?',
            onOk() {
                deleteMethod(item)
            }
        })
    }
    const switchMethod = (item) => {
        item.pagepermisson = item.pagepermisson === 1 ? 0 : 1;
        setDataSource([...dataSource])
        if (item.grade === 1) {
            axios.patch(`http://localhost:5000/rights/${item.id}`, { pagepermisson: item.pagepermisson })
        } else {
            axios.patch(`http://localhost:5000/children/${item.id}`, { pagepermisson: item.pagepermisson })
        }

    }
    const deleteMethod = (item) => {
        if (item.grade === 1) {
            setDataSource(dataSource.filter(temp => temp.id !== item.id));
            axios.delete(`http://localhost:5000/rights/${item.id}`)
        } else {
            let list = dataSource.filter(temp => temp.id === item.rightId)
            list[0].children = list[0].children.filter(temp => temp.id !== item.id)
            setDataSource([...dataSource])
            axios.delete(`http://localhost:5000/children/${item.id}`)
        }

    }
    return (
        <div>
            <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }}></Table>
        </div>
    )
}
