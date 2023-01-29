import React, { useState, useEffect, useRef } from 'react'
import { Table, Button, Switch, Modal } from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import axios from 'axios'
import UserForm from './../../../components/user-manage/UserForm'
export default function UserList() {
  const [dataSource, setDataSource] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdataOpen, setIsUpdataOpen] = useState(false);
  const [roleList, setRoleList] = useState([]);
  const [regionList, setRegionList] = useState([]);
  const [isUpdataDisabled, setIsUpdataDisabled] = useState(false);
  const [current, setCurrent] = useState(null);
  const addForm = useRef(null)
  const updataForm = useRef(null)
  const { roleId, region, username } = JSON.parse(localStorage.getItem('token'))

  useEffect(() => {
    const roleObj = {
      '1': 'superadmin',
      '2': 'admin',
      '3': 'editor'
    }
    axios.get('http://localhost:5000/users?_expand=role')
      .then(res => {
        const list = res.data;
        setDataSource(roleObj[roleId] === "superadmin" ? list : [
          ...list.filter(item => item.username === username),//把自己过滤出来，同时把同一个区域的编辑的过滤出来
          ...list.filter(item => item.region === region && roleObj[item.roleId] === 'editor')
        ])
      })
  }, [roleId, region, username])
  useEffect(() => {
    axios.get('http://localhost:5000/roles')
      .then(res => {
        setRoleList(res.data)
      })
  }, [])
  useEffect(() => {
    axios.get('http://localhost:5000/regions')
      .then(res => {
        setRegionList(res.data)
      })
  }, [])
  const columns = [
    {
      title: '区域',
      dataIndex: 'region',
      filters: [
        ...regionList.map(item => ({
          text: item.title,
          value: item.value
        })),
        {
          text: '全球',
          value: '全球'
        }
      ],
      onFilter: (value, item) => {
        if (value === '全球') {
          return item.region === '';
        }
        return item.region === value
      },
      render: region => {
        return region === '' ? <b>全球</b> : <b>{region}</b>
      }
    },
    {
      title: '角色名称',
      dataIndex: 'role',
      render: role => {
        return role.roleName;
      }
    },
    {
      title: '用户名',
      dataIndex: 'username'
    },
    {
      title: '用户状态',
      dataIndex: 'roleState',
      render: (roleState, item) => <Switch checked={roleState} disabled={item.default} onChange={() => { handleChange(item) }} />
    },
    {
      title: '操作',
      render: (item) => {
        return (
          <div >
            <Button shape="circle" danger icon={<DeleteOutlined />} disabled={item.default} onClick={() => { confirmMethod(item) }}></Button>
            <Button shape="circle" type='primary' icon={<EditOutlined />} disabled={item.default} onClick={() => { handleUpdata(item) }}></Button>
          </div >)
      }
    },
  ]
  //切换switch开关
  const handleChange = (item) => {
    item.roleState = !item.roleState;
    setDataSource([...dataSource]);
    axios.patch(`http://localhost:5000/users/${item.id}`, {
      roleState: item.roleState
    })
  }
  //弹出确定删除框
  const confirmMethod = (item) => {
    Modal.confirm({
      title: '你确定要删除吗?',
      onOk() {
        deleteMethod(item)
      }
    })
  }
  //删除
  const deleteMethod = (item) => {
    setDataSource(dataSource.filter(data => data.id !== item.id))
    axios.delete(`http://localhost:5000/users/${item.id}`)
  }
  //编辑 出现模态框并且有表单选填内容
  const handleUpdata = async (item) => {
    await setIsUpdataOpen(true);
    if (item.roleId === 1) {
      setIsUpdataDisabled(true);
    } else {
      setIsUpdataDisabled(false)
    }
    updataForm.current.setFieldsValue(item);
    setCurrent(item);
  }
  //添加用户
  const addFormOk = () => {
    addForm.current.validateFields().then(value => {
      setIsOpen(false);
      addForm.current.resetFields()
      axios.post(`http://localhost:5000/users`, {
        ...value,
        "roleState": true,
        "default": false,
      }).then(res => {
        setDataSource([...dataSource, { ...res.data, role: roleList.filter(item => item.id === value.roleId)[0] }])
      })
    }).catch(err => {
      console.log(err)
    })
  }
  //更新
  const updataFormOk = () => {
    updataForm.current.validateFields().then(value => {
      setIsUpdataOpen(false);
      setDataSource(dataSource.map(item => {
        if (item.id === current.id) {
          return {
            ...item,
            ...value,
            role: roleList.filter(data => data.id === value.roleId)[0],
          }
        }
        return item;
      }))
      setIsUpdataDisabled(!isUpdataDisabled);
      axios.patch(`http://localhost:5000/users/${current.id}`,
        value
      )
    }).catch(err => {
      console.log(err)
    })
  }
  return (
    <div>
      <Button type='primary' onClick={() => { setIsOpen(true) }}>添加用户</Button>
      <Table dataSource={dataSource} columns={columns} rowKey={(item) => item.id} pagination={{ pageSize: 5 }}></Table>
      <Modal
        open={isOpen}
        title="添加用户"
        okText="确定"
        cancelText="取消"
        onCancel={() => { setIsOpen(false) }}
        onOk={addFormOk}
      >
        <UserForm roleList={roleList} regionList={regionList} ref={addForm} />
      </Modal>
      <Modal
        open={isUpdataOpen}
        title="更新用户"
        okText="更新"
        cancelText="取消"
        onCancel={() => {
          setIsUpdataOpen(false);
          setIsUpdataDisabled(!isUpdataDisabled);
        }}
        onOk={updataFormOk}
      >
        <UserForm isUpdate={true} isUpdataDisabled={isUpdataDisabled} roleList={roleList} regionList={regionList} ref={updataForm} />
      </Modal>
    </div>
  )
}
