import React, { useEffect, useState, useRef } from 'react'
import { PageHeader, Steps, Button, Form, Input, Select, message, notification } from 'antd'
import style from './News.module.css'
import axios from 'axios';
import NewsEditor from '../../../components/news-manage/NewsEditor';
const { Step } = Steps;
const { Option } = Select
export default function NewsAdd(props) {
    const [current, setCurrent] = useState(0)
    const [categoryList, setCategoryList] = useState([])
    const [formInfo, setformInfo] = useState({})
    const [content, setContent] = useState("")
    const User = JSON.parse(localStorage.getItem("token"))//把region值拿出来
    const handleNext = () => {
        // 点击下一步 对current值做判断 如果为0 就是第一步 先通过表单校验 然后放行/否则else就是下一步
        if (current === 0) {
            NewsForm.current.validateFields().then(res => {
                // console.log(res)
                setformInfo(res) //将res数据放到formInfo中（state）
                setCurrent(current + 1)
            }).catch(error => {
                console.log(error)
            })
        } else {
            if (content === "" || content.trim() === "<p></p>") {
                message.error("新闻内容不能为空")
            } else {
                setCurrent(current + 1)
            }
            // console.log(formInfo, content)//点击下一步按钮时，能获得forminfo和content信息
            // setCurrent(current + 1)
        }
    }
    const handlePrevious = () => {
        setCurrent(current - 1)
    }
    const NewsForm = useRef(null)//通过useRef钩子获得表单ref
    useEffect(() => {
        axios.get("/categories").then(res => {
            // console.log(res.data)
            setCategoryList(res.data)
        })
    }, [])

    const handleSave = (auditState) => {
        axios.post("/news", {
            ...formInfo,
            "content": content,
            "region": User.region ? User.region : "全球",//有值就为真显示，为空字符串的话就为假显示全球
            "author": User.username,
            "roleId": User.roleId,
            "auditState": auditState,
            "publishState": 0,
            "createTime": Date.now(),
            "star": 0,
            "view": 0,
            // "publishTime": 0
        }).then(res => {
            props.history.push(auditState === 0 ? "/news-manage/draft" : "/audit-manage/list")//根据auditstate的值判断去草稿箱还是审核
            notification.info({
                message: `通知`,
                description:
                    `您可以到${auditState === 0 ? '草稿箱' : '审核列表'}中查看您的新闻`,
                placement: "bottomRight",
            })
        })
    }
    return (
        <div>
            <PageHeader   //标题头组件
                className="site-page-header"
                title="撰写新闻"
                subTitle="This is a subtitle"
            />
            <Steps current={current}>
                {/* 改变current里的值,进度条也会变 */}
                <Step title="基本信息" description="新闻标题，新闻分类" />
                <Step title="新闻内容" description="新闻主体内容" />
                <Step title="新闻提交" description="保存草稿或者提交审核" />
            </Steps>
            <div style={{ marginTop: "50px" }}>
                <div className={current === 0 ? '' : style.active}>

                    <Form
                        name="basic"
                        labelCol={{
                            span: 2,
                        }}
                        wrapperCol={{
                            span: 22,
                        }}
                        ref={NewsForm}//输入标题和分类后点击下一步之前进行验证 
                    //点击下一步按钮 就会通过ref拿到form的实例validatefields?进行校验,校验通过就会走.then

                    >
                        <Form.Item
                            label="新闻标题"
                            name="title"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your username!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="新闻分类"
                            name="categoryId"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your username!',
                                },
                            ]}
                        >
                            <Select >
                                {/* 通过useState钩子设置全局state(categoryList) 然后通过useEffect钩子函数发送异步成功后用setaCategoryList将取回的数据更新至usestate中的categoryList 遍历categoryList显示在option中 */}
                                {
                                    categoryList.map(item =>
                                        <Option value={item.id} key={item.id}>{item.title}</Option>
                                    )
                                }
                            </Select>
                        </Form.Item>
                    </Form>
                </div>
                <div className={current === 1 ? '' : style.active}>
                    {/* 在components中新建一个文件夹new-manage 新建文件NewsEditor组件(富文本编辑器)*/}
                    {/* 数据子传父 父组件给子组件发送一个回调函数  子组件通过props接收 点击回调函数 从而达到父子传值 */}
                    <NewsEditor getContent={(value) => {
                        // console.log(value)
                        setContent(value) //将回调函数回来的数据存放到content中（state）

                    }}></NewsEditor>
                </div>
                <div className={current === 2 ? '' : style.active}></div>
            </div>
            <div style={{ marginTop: "50px" }}>
                {
                    current === 2 && <span>
                        <Button type="primary" onClick={() => handleSave(0)}>保存草稿箱</Button>
                        <Button danger onClick={() => handleSave(1)}>提交审核</Button>
                    </span>
                }
                {
                    current < 2 && <Button type="primary" onClick={handleNext}>下一步</Button>
                }
                {
                    current > 0 && <Button onClick={handlePrevious}> 上一步</Button>
                }
            </div>
        </div >
    )
}
