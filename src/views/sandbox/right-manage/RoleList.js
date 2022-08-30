import React, { useState, useEffect } from 'react'
import { Table, Button, Modal, Tree } from 'antd'
import { UnorderedListOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import axios from 'axios'
const { confirm } = Modal;
export default function RoleList() {
    const [dataSource, setdataSource] = useState([])
    const [rightList, setRightList] = useState([])
    const [currentRights, setcurrentRights] = useState([])
    const [currentId, setcurrentId] = useState(0)
    const [loading, setLoading] = useState(false);//加loading
    const [isModalVisible, setisModalVisible] = useState(false)
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: (id) => {
                return <b>{id}</b>
            }
        },
        {
            title: '角色名称',
            dataIndex: 'roleName',
        },
        {
            title: '操作',
            render: (item) => {
                return <div>
                    <Button danger shape="circle" icon={<DeleteOutlined />}
                        onClick={() => confirmMethod(item)} />
                    <Button type="primary" shape="circle" icon={<UnorderedListOutlined />} onClick={() => {
                        setisModalVisible(true)
                        setcurrentRights(item.rights)
                        setcurrentId(item.id)
                    }} />

                </div>
            }
        },
    ]
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
        //当前页面同步状态+后端同步
        //1.前端删除
        setdataSource(dataSource.filter(data => data.id !== item.id)) //把dataSource中的数据与点击的item相比,不相等就过滤出来，相等就不过滤，即为删除，引发重新render
        //2.后端删除+loading
        setLoading(true);
        axios.delete(`/roles/${item.id}`).then(res => {
            setLoading(false);
        })
    }
    useEffect(() => {
        axios.get("/roles").then(res => {
            // console.log(res.data)
            setdataSource(res.data)
        })
    }, [])
    useEffect(() => {
        axios.get("/rights?_embed=children").then(res => {
            // console.log(res.data)
            setRightList(res.data)
        })
    }, [])
    const handleOk = () => {
        console.log(currentRights)
        setisModalVisible(false)//弹窗关闭
        //同步dataSource
        setdataSource(dataSource.map(item => {
            if (item.id === currentId) {
                return {
                    ...item,
                    rights: currentRights
                }
            }
            return item
        }))
        //patch到后端
        axios.patch(`/roles/${currentId}`, {
            rights: currentRights
        })
    }

    const handleCancel = () => {
        setisModalVisible(false)
    }
    const onCheck = (checkKeys) => {
        console.log(checkKeys)
        setcurrentRights(checkKeys.checked)
    }
    return (
        <div>
            {/* rowKeys用于解决没有key值问题 */}
            <Table dataSource={dataSource} columns={columns} rowKey={(item) => item.id} loading={loading}></Table>
            < Modal title="权限分配" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Tree
                    checkable//可选择的
                    checkedKeys={currentRights} // defaultCheckedKeys驼峰写法为非受控组件，只会初始化时刷新一次，改为小驼峰。
                    onCheck={onCheck}
                    treeData={rightList}
                    checkStrictly={true}//取消父子关联
                />
            </Modal>
        </div>
    )
}
