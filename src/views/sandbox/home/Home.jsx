import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { Card, Row, Col, List, Avatar, Drawer } from 'antd'
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import * as echarts from 'echarts';
import _ from 'lodash'
const { Meta } = Card;
export default function Home() {
  const [viewList, setviewList] = useState([])
  const [starList, setstarList] = useState([])
  const [allList, setallList] = useState([])
  const [visible, setvisible] = useState(false)
  const [pieChart, setpieChart] = useState(null)
  const barRef = useRef()
  const pieRef = useRef()
  useEffect(() => {
    axios.get(`/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6`).then(res => {
      setviewList(res.data)

    })
  }, [])
  useEffect(() => {
    axios.get(`/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6`).then(res => {
      setstarList(res.data)
    })
  }, [])
  useEffect(() => {
    axios.get(`/news?_expand=category&publishState=2`).then(res => {
      renderBarView(_.groupBy(res.data, item => item.category.title))
      setallList(res.data)
    })
    return () => {
      window.onresize = null
    }
  }, [])
  const { username, role: { roleName }, region } = JSON.parse(localStorage.getItem('token'))
  const renderBarView = (obj) => {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(barRef.current);

    // 指定图表的配置项和数据
    var option = {
      title: {
        text: '新闻分类图标'
      },
      tooltip: {},
      legend: {
        data: ['数量']
      },
      xAxis: {
        data: Object.keys(obj),
        axisLabel: {
          rotate: '45',
          interval: 0
        }
      },
      yAxis: {
        minInterval: 1
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
      myChart.resize()
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
      myChart = echarts.init(pieRef.current);
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
              <SettingOutlined key="setting" onClick={async () => {
                await setvisible(true)//点击抽屉出现，加入异步中有同步更新的效果
                await renderPieView()
              }} />,
              < EditOutlined key="edit" />,
              <EllipsisOutlined key="ellipsis" />,
            ]}
          >
            <Meta
              avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
              title={username}
              description={
                <div>
                  <b>{region ? region : '全球'}</b>
                  <span style={{ paddingLeft: '30px' }}>{roleName}</span>
                </div>
              }
            />
          </Card>
        </Col>
      </Row>
      <Drawer
        width='500px'
        title="个人新闻发布"
        placement="right"
        open={visible}
        closable={true}
        onClose={() => { setvisible(false) }}
      >
        <div id='main' style={{ height: '400px', marginTop: '30px' }} ref={pieRef}>
        </div>
      </Drawer>
      <div id='main' style={{ height: '400px', marginTop: '30px' }} ref={barRef}>
      </div>
    </div>
  )
}
