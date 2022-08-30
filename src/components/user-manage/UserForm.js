import React, { forwardRef, useEffect, useState } from 'react'
import { Form, Input, Select } from 'antd'
const { Option } = Select
const UserForm = forwardRef((props, ref) => {
    const [isDisabled, setisDisabled] = useState(false)
    useEffect(() => {
        setisDisabled(props.isUpdateDisabled)
    }, [props.isUpdateDisabled]) //父子传值  当点击编辑超级管理员时,区域栏直接禁用，其他不禁用
    const roleObj = {
        "1": "superadmin",
        "2": "admin",
        "3": "editor"
    }
    const { roleId, region } = JSON.parse(localStorage.getItem("token"))
    const checkRegionDisabled = (item) => {//通过checkRegionDisabled改变option的Disabled的true false值 控制下拉栏内的值可选可不选
        if (props.isUpdate) {
            if (roleObj[roleId] === "superadmin") {
                return false
            } else {
                return true
            }
        } else {
            if (roleObj[roleId] === "superadmin") {
                return false
            } else {
                // return  当前项！==region
                return item.value !== region

            }
        }
    }
    const checkRoleDisabled = (item) => {//通过checkRegionDisabled改变option的Disabled的true false值 控制下拉栏内的值可选可不选
        if (props.isUpdate) {
            if (roleObj[roleId] === "superadmin") {
                return false
            } else {
                return true
            }
        } else {
            if (roleObj[roleId] === "superadmin") {
                return false
            } else {
                // return  当前项！==region
                return roleObj[item.id] !== "editor"

            }
        }
    }

    return (
        <Form
            ref={ref}
            layout="vertical"

        >
            <Form.Item
                name="username"
                label="用户名"
                rules={[
                    {
                        required: true,
                        message: 'Please input the title of collection!',
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="password"
                label="密码"
                rules={[
                    {
                        required: true,
                        message: 'Please input the title of collection!',
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="region"
                label="区域"
                rules={isDisabled ? [] : [//解决区域为空时此栏提交没有值报错问题
                    {
                        required: true,
                        message: 'Please input the title of collection!',
                    },
                ]}
            >
                <Select disabled={isDisabled}>
                    {
                        props.regionList.map(item =>
                            <Option value={item.value} key={item.id} disabled={checkRegionDisabled(item)}>{item.title}</Option>
                        )
                    }
                </Select>
            </Form.Item>
            <Form.Item
                name="roleId"
                label="角色"
                rules={[
                    {
                        required: true,
                        message: 'Please input the title of collection!',
                    },
                ]}
            >
                <Select onChange={(value) => {
                    if (value === 1) {
                        setisDisabled(true)//当点击值为1(1是超级管理员)时，通过设置setisDisabled将Disisabled状态设置为true不可选状态,同时将区域选项输入栏设置为空。
                        ref.current.setFieldsValue({
                            region: ""
                        })
                    } else {
                        setisDisabled(false)
                    }
                }}>
                    {
                        props.roleList.map(item =>
                            <Option value={item.id} key={item.id} disabled={checkRoleDisabled(item)}>{item.roleName}</Option>
                        )
                    }
                </Select>
            </Form.Item>
        </Form>
    )
})
export default UserForm
