import React, { useEffect, useState } from 'react'
import axios from 'axios'
import _ from 'lodash'
import { PageHeader, Row, Col, Card, List } from 'antd'
export default function News() {
  const [list, setlist] = useState([])
  useEffect(() => {
    axios.get(`/news?publishState=2&_expand=category`).then(res => {
      setlist(Object.entries(_.groupBy(res.data, item => item.category.title)))
    })
  }, [])

  return (
    <div style={{ width: '95%', margin: '0 auto' }}>
      <PageHeader
        className='site-page-header'
        pagination={{ pageSize: 3 }}
        title='全球大新闻'
        subTitle='查看新闻'
      />
      <div className="site-card-wrapper">
        <Row gutter={[16, 16]}>
          {
            list.map(item =>
              <Col span={8} key={item[0]}>
                <Card title={item[0]} bordered={true} hoverable={true}>
                  <List
                    size="small"
                    pagination={{ pageSize: 2 }}
                    dataSource={item[1]}
                    renderItem={data => <List.Item><a href={`#/detail/${data.id}`}>{data.title}</a></List.Item>}
                  />
                </Card>
              </Col>
            )
          }

        </Row>
      </div>
    </div>
  )
}
