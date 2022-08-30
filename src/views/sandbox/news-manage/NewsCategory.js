import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, Table, Modal, Form, Input } from 'antd'
import axios from 'axios'
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
const { confirm } = Modal;
export default function NewsCategory() {
    const [dataSource, setdataSource] = useState([])
    useEffect(() => {
        axios.get("/categories").then(res => {

            setdataSource(res.data)
        }
        )
    }, [])
    const handleSave = (record) => {
        // console.log(record)
        setdataSource(dataSource.map(item => {
            if (item.id === record.id) {
                return {
                    id: item.id,
                    title: record.title,
                    value: record.value
                }
            }
            return item
        }))
        axios.patch(`categories/${record.id}`, {
            title: record.title,
            value: record.value
        })
    }
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: (id) => {//render属性是自定义样式
                return <b>{id}</b>
            }
        },
        {
            title: '栏目名称',
            dataIndex: 'title',
            onCell: (record) => ({
                record,
                editable: true,
                dataIndex: 'title',
                title: '栏目名称',
                handleSave: handleSave,//失去焦点的回调函数
            }),
        },
        {
            title: '操作',
            render: (item) => {
                return <div>
                    <Button danger shape="circle" icon={<DeleteOutlined />}
                        onClick={() => confirmMethod(item)} />
                </div>
            }
        },
    ];

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
        //1.前端删除
        setdataSource(dataSource.filter(data => data.id !== item.id)) //把dataSource中的数据与点击的item相比,不相等就过滤出来，相等就不过滤，即为删除，引发重新render
        //2.后端删除
        axios.delete(`/categories/${item.id}`)
    }

    //antdTable表格中的可控单元格
    const EditableContext = React.createContext(null);//上下文对象
    const EditableRow = ({ index, ...props }) => {
        const [form] = Form.useForm();
        return (
            <Form form={form} component={false}>
                <EditableContext.Provider value={form}>
                    <tr {...props} />
                </EditableContext.Provider>
            </Form>
        );
    };

    const EditableCell = ({
        title,
        editable,
        children,
        dataIndex,
        record,
        handleSave,
        ...restProps
    }) => {
        const [editing, setEditing] = useState(false);
        const inputRef = useRef(null);
        const form = useContext(EditableContext);//hooks全局上下文对象
        useEffect(() => {
            if (editing) {
                inputRef.current.focus();
            }
        }, [editing]);

        const toggleEdit = () => {
            setEditing(!editing);
            form.setFieldsValue({
                [dataIndex]: record[dataIndex],
            });
        };

        const save = async () => {
            try {
                const values = await form.validateFields();
                toggleEdit();
                handleSave({ ...record, ...values });
            } catch (errInfo) {
                console.log('Save failed:', errInfo);
            }
        };

        let childNode = children;

        if (editable) {
            childNode = editing ? (
                <Form.Item
                    style={{
                        margin: 0,
                    }}
                    name={dataIndex}
                    rules={[
                        {
                            required: true,
                            message: `${title} is required.`,
                        },
                    ]}
                >
                    <Input ref={inputRef} onPressEnter={save} onBlur={save} />
                </Form.Item>
            ) : (
                <div
                    className="editable-cell-value-wrap"
                    style={{
                        paddingRight: 24,
                    }}
                    onClick={toggleEdit}
                >
                    {children}
                </div>
            );
        }

        return <td {...restProps}>{childNode}</td>;
    };
    return (
        <div>
            <Table dataSource={dataSource} columns={columns}
                pagination={{
                    pageSize: 5
                }}
                rowKey={item => item.id}
                components={{
                    body: {
                        row: EditableRow,
                        cell: EditableCell,
                    },
                }}
            />;
        </div>
    )
}
