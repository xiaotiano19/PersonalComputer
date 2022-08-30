
import NewsPublish from '../../../components/publish-manage/NewsPublish'
import usePublish from '../../../components/publish-manage/usePublish'
import { Button } from 'antd'
export default function Unpublished() {
    const { dataSource, handlePublish } = usePublish(1)
    //1表示待发布的
    return (
        <div>
            <NewsPublish dataSource={dataSource} button={(id) => <Button type="primary" onClick={() => handlePublish(id)}>发布</Button>} ></NewsPublish>
        </div>
    )
}
