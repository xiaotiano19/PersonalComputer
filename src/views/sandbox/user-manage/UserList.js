import React, { useState, useEffect, useRef } from 'react'
import { Button, Table, Modal, Switch } from 'antd'
import axios from 'axios'
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import UserForm from '../../../components/user-manage/UserForm';
const { confirm } = Modal;
export default function UserList() {
    const [dataSource, setdataSource] = useState([])
    const [isAddVisible, setisAddVisible] = useState(false)
    const [isUpdateVisible, setisUpdateVisible] = useState(false)
    const [roleList, setroleList] = useState([])
    const [regionList, setregionList] = useState([])
    const [current, setcurrent] = useState(null)
    const [isUpdateDisabled, setisUpdateDisabled] = useState(false)
    const updateForm = useRef(null)
    const addForm = useRef(null)
    const { roleId, region, username } = JSON.parse(localStorage.getItem("token"))

    useEffect(() => {
        const roleObj = {
            "1": "superadmin",
            "2": "admin",
            "3": "editor"
        }
        axios.get("/users?_expand=role").then(res => {
            const list = res.data
            setdataSource(roleObj[roleId] === "superadmin" ? list : [
                ...list.filter(item => item.username === username),//把自己过滤出来，同时把同一个区域的编辑的过滤出来
                ...list.filter(item => item.region === region && roleObj[item.role.roleId] === "editor")
            ])
        }
        )
    }, [roleId, region, username])
    useEffect(() => {
        axios.get("/regions").then(res => {
            const list = res.data
            setregionList(list)
        }
        )
    }, [])
    useEffect(() => {
        axios.get("/roles").then(res => {
            const list = res.data
            setroleList(list)
        }
        )
    }, [])
    const columns = [
        {
            title: '区域',
            dataIndex: 'region',
            filters: [
                ...regionList.map(item => ({//区域过滤栏里的内容
                    text: item.title,
                    value: item.value
                })),
                {
                    text: "全球",
                    value: "全球"
                }
            ],
            onFilter: (value, item) => {//确定按钮
                if (value === "全球") {
                    return item.region === ""
                } else {
                    return item.region === value
                }
            },
            render: (region) => {
                return <b>{region === "" ? '全球' : region}</b>
            }
        },
        {
            title: '角色名称',
            dataIndex: 'role',
            render: (role) => {
                return role?.roleName//不加问号会在第一次添加后报错
            }
        },
        {
            title: '用户名',
            dataIndex: 'username',
        },
        {
            title: '用户状态',
            dataIndex: 'roleState',
            render: (roleState, item) => {
                return <Switch checked={roleState} disabled={item.default} onChange={() => handleChange(item)}></Switch>
            }
        },
        {
            title: '操作',
            render: (item) => {
                return <div>
                    <Button danger shape="circle" icon={<DeleteOutlined />}
                        onClick={() => confirmMethod(item)} disabled={item.default} />
                    <Button type="primary" shape="circle" icon={<EditOutlined />} onClick={() => handleUpdate(item)} disabled={item.default} />
                </div>
            }
        },
    ];

    const handleUpdate = async (item) => {
        //把下面两个操作统一放在异步中执行解决两个设置不同步报错问题/也可以用setTimeout
        await setisUpdateVisible(true)//模态框出来
        if (item.roleId === 1) {
            //禁用
            setisUpdateDisabled(true)
        } else {
            //取消禁用
            setisUpdateDisabled(false)
        }
        updateForm.current.setFieldsValue(item) //模态框数据出来
        setcurrent(item)
    };

    //第二种写法
    // setTimeout(() => {
    //     updateForm.current.setFieldsValue(item)
    // }, 0)
    // setisUpdateVisible(true)
    // }
    const handleChange = (item) => {//让开关按钮能关闭
        item.roleState = !item.roleState
        setdataSource([...dataSource])
        axios.patch(`/users/${item.id}`, {
            roleState: item.roleState//补丁式修改后台数据的rolestate
        })
    }
    //删除弹窗事件
    const confirmMethod = (item) => {
        confirm({
            title: '你确定要删除?',
            icon: <ExclamationCircleOutlined />,
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
        console.log(item)
        //当前页面同步状态+后端同步
        //1.前端删除
        setdataSource(dataSource.filter(data => data.id !== item.id)) //把dataSource中的数据与点击的item相比,不相等就过滤出来，相等就不过滤，即为删除，引发重新render
        //2.后端删除
        axios.delete(`/users/${item.id}`)
    }
    const addFormOK = () => {
        addForm.current.validateFields().then(value => {
            setisAddVisible(false)
            addForm.current.resetFields()//重置表单内容为空
            //post到后端，生成ID，再设置datasource,方便后边的删除和更新
            axios.post(`/users`, {
                ...value,
                "roleState": true,
                "default": false,
            }).then(res => {
                console.log(res.data)
                setdataSource([...dataSource, {
                    ...res.data,
                    role: roleList.filter(item => item.id === value.roleId)[0]
                }])
            }).catch(err => {
                console.log(err)
            })
        })
    }
    const updateFormOK = () => {
        updateForm.current.validateFields().then(value => {
            // console.log(value)
            setisUpdateVisible(false)

            setdataSource(dataSource.map(item => {
                if (item.id === current.id) {
                    return {
                        ...item,
                        ...value,
                        role: roleList.filter(data => data.id === value.roleId)[0]
                    }
                }
                return item
            }))
            setisUpdateDisabled(!isUpdateDisabled)
            axios.patch(`/users/${current.id}`, value)
        })
    }
    return (
        <div>
            <Button type="primary" onClick={() => {
                setisAddVisible(true)
            }}>添加用户</Button>
            <Table dataSource={dataSource} columns={columns}
                pagination={{
                    pageSize: 5
                }}
                rowKey={item => item.id}
            />
            <Modal
                visible={isAddVisible}
                title="添加用户"
                okText="确定"
                cancelText="取消"
                onCancel={() => {
                    setisAddVisible(false);
                    addForm.current.resetFields()//重置表单内容为空
                }}
                onOk={() => addFormOK()}
            >
                <UserForm regionList={regionList} roleList={roleList} ref={addForm}></UserForm>
            </Modal>
            <Modal
                visible={isUpdateVisible}
                title="更新用户"
                okText="更新"
                cancelText="取消"
                onCancel={() => {
                    setisUpdateVisible(false)
                    setisUpdateDisabled(!isUpdateDisabled)//解决点击超级管理员时取消后再次打开值会传入而且不可选bug
                }}
                onOk={() => updateFormOK()}
            >
                <UserForm regionList={regionList} roleList={roleList} ref={updateForm} isUpdateDisabled={isUpdateDisabled} isUpdate={true}></UserForm>
                {/* //isUpdate={true}通过ref传递给userform 然后userform通过props属性接受到 从而判断菜单栏内的值是否可选 */}
            </Modal>
        </div >
    )
}
