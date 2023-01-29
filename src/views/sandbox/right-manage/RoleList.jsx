import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Table, Button, Modal, Tree } from 'antd'
import { DeleteOutlined, UnorderedListOutlined } from '@ant-design/icons';
export default function RoleList() {
  const [dataSource, setDataSource] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [rightList, setRightList] = useState([])
  const [currentRights, setCurrentRights] = useState([])
  const [currentId, setCurrentId] = useState(0)

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
      dataIndex: 'roleName'
    },
    {
      title: '操作',
      render: (item) => {
        return (
          <div >
            <Button shape="circle" danger icon={<DeleteOutlined />} onClick={() => { confirmMethod(item) }}></Button>
            <Button shape="circle" type='primary' icon={<UnorderedListOutlined />}
              onClick={() => {
                setIsModalVisible(true);
                setCurrentRights(item.rights);
                setCurrentId(item.id)
              }}></Button>
          </div >)
      }
    },

  ];
  useEffect(() => {
    axios.get('http://localhost:5000/roles')
      .then(res => {
        setDataSource(res.data)
      })
  }, [])
  useEffect(() => {
    axios.get('http://localhost:5000/rights?_embed=children')
      .then(res => {
        setRightList(res.data)
      })
  }, [])
  const confirmMethod = (item) => {
    Modal.confirm({
      title: '你确定要删除吗?',
      onOk() {
        deleteMethod(item)
      }
    })
  }
  const deleteMethod = (item) => {
    setDataSource(dataSource.filter(data => item.id !== data.id))
    axios.delete(`http://localhost:5000/roles/${item.id}`)
  }
  const handleOk = () => {
    setIsModalVisible(false);
    setDataSource(dataSource.map(item => {
      if (item.id === currentId) {
        return {
          ...item,
          rights: currentRights
        }
      }
      return item
    }))
    //patch同步后台
    axios.patch(`http://localhost:5000/roles/${currentId}`, {
      rights: currentRights
    })
  }
  const handleCancel = () => {
    setIsModalVisible(false)
  }
  const onCheck = (checkedKeys, info) => {
    setCurrentRights(checkedKeys.checked)
  }
  return (
    <div>
      <Table dataSource={dataSource} columns={columns} rowKey={(item) => item.id} />
      <Modal title='权限分配' visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Tree
          checkable
          checkStrictly
          treeData={rightList}
          checkedKeys={currentRights}
          onCheck={onCheck}
        />
      </Modal>
    </div>
  )
}
