import React, { useEffect, useState, useRef } from 'react'
import { Card, Col, Row, List, Avatar, Drawer } from 'antd';
//card组件
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import axios from 'axios';
import * as Echarts from 'echarts'//安装echarts包 导入
import _ from 'lodash' //引入lodash做数组去重
const { Meta } = Card;
export default function Home() {
    const [viewList, setviewList] = useState([])
    const [starList, setstarList] = useState([])
    const [allList, setallList] = useState([])
    const [visible, setvisible] = useState(false)//抽屉
    const [pieChart, setpieChart] = useState(null)//饼图
    const barRef = useRef()
    const pieRef = useRef()
    useEffect(() => {
        axios.get(`/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6`).then(res => {
            setviewList(res.data)
        })
        //publishState=2为已经发布的 sort为正序，_order=desc为倒叙，_limit=6为最近6条数据
    }, [])
    useEffect(() => {
        axios.get(`/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6`).then(res => {
            setstarList(res.data)
        })
        //sort为正序，_order=desc为倒叙，_limit=6为最近6条数据
    }, [])
    useEffect(() => {
        axios.get(`news?publishState=2&_expand=category`).then(res => {
            // console.log(res.data)
            //把回来的数据以item.category.title进行分组，
            renderBarView(_.groupBy(res.data, item => item.category.title))
            setallList(res.data)
        })
        return () => {
            window.onresize = null //为了避免每次从首页切换时resize时间一直被调用 设置组件销毁时设置window.resize为空
        }
    }, [])
    const renderBarView = (obj) => {//柱状图
        // 基于准备好的dom，初始化echarts实例
        var myChart = Echarts.init(barRef.current);//barRef.current为真正的dom节点
        // 指定图表的配置项和数据
        var option = {
            title: {
                text: '新闻分类图示'
            },
            tooltip: {},
            legend: {
                data: ['数量']
            },
            xAxis: {
                data: Object.keys(obj),//传过来的是对象 用Object.keys方法获得键名组成的数组
                axisLabel: {
                    //刻度标签旋转的角度，在类目轴的类目标签显示不下的时候可以通过旋转防止标签之间重叠。
                    //旋转的角度从 -90 度到 90 度。
                    rotate: "45",
                    interval: 0//设置成 0 强制显示所有标签。
                }
            },
            yAxis: {
                minInterval: 1//最小间隔
            },
            series: [
                {
                    name: '数量',
                    type: 'bar',
                    data: Object.values(obj).map(item => item.length)
                }
            ]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        window.onresize = () => {
            console.log("resize")
            myChart.resize()//做响应式
        }
    }
    const renderPieView = (obj) => {//饼状图
        //数据处理工作
        var currentList = allList.filter(item => item.author === username)
        // console.log(currentList)
        var groupObj = _.groupBy(currentList, item => item.category.title)
        // console.log(groupObj)
        var list = []
        for (var i in groupObj) {
            list.push({
                name: i,
                value: groupObj[i].length
            })
        }
        // console.log(list)
        var myChart;
        if (!pieChart) {//防止echarts创建多次报错
            myChart = Echarts.init(pieRef.current);
            setpieChart(myChart)
        }
        var option;

        option = {
            title: {
                text: '当前用户新闻分类图示',
                left: 'center'
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                left: 'left'
            },
            series: [
                {
                    name: '发布数量',
                    type: 'pie',
                    radius: '50%',
                    data: list,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };

        option && myChart?.setOption(option);//加可选链符?解决报错问题

    }
    const { username, region, role: { roleName } } = JSON.parse(localStorage.getItem("token"))
    return (
        <div className="site-card-wrapper">
            <Row gutter={16}>
                <Col span={8}>
                    <Card title="用户最常浏览" bordered={true}>
                        <List
                            size="small"
                            dataSource={viewList}
                            renderItem={(item) => <List.Item><a href={`#/news-manage/preview/${item.id}`}>{item.title}</a></List.Item>}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="用户点赞最多" bordered={true}>
                        <List
                            size="small"
                            dataSource={starList}
                            renderItem={(item) => <List.Item><a href={`#/news-manage/preview/${item.id}`}>{item.title}</a></List.Item>}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card
                        cover={
                            <img
                                alt="example"
                                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                            />
                        }
                        actions={[
                            //async/await用于解决异步 也可以用settimeout解决
                            <SettingOutlined key="setting" onClick={async () => {
                                await setvisible(true)//点击抽屉出现，加入异步中有同步更新的效果
                                //init初始化
                                await renderPieView()//调用饼状图
                            }} />,
                            <EditOutlined key="edit" />,
                            <EllipsisOutlined key="ellipsis" />,
                        ]}
                    >
                        <Meta
                            avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                            title={username}
                            description={
                                <div>
                                    <b>{region ? region : "全球"}</b>
                                    <span style={{ paddingLeft: "30px" }}>{roleName}</span>
                                </div>
                            }
                        />
                    </Card>
                </Col>
            </Row>
            <Drawer
                // 抽屉
                width="500px"
                title="个人新闻分类"
                placement="right"
                onClose={() => {
                    setvisible(false)
                }}
                visible={visible}
            >
                <div ref={pieRef} style={{
                    width: "100%",
                    height: "400px",
                    marginTop: "30px"
                }}></div>
            </Drawer>
            <div ref={barRef} style={{
                width: "100%",
                height: "400px",
                marginTop: "30px"
            }}></div>
        </div >
    )

}
