import {Row, Col, Button, List} from 'antd';

import { useGetDatasetsQuery } from '../../redux/api';

function Datasets() {

    const { data } = useGetDatasetsQuery();    
    
    return (
        <>
            <Row>
                <Col span={12}>
                    <h1>Datasets</h1>
                </Col>
                <Col span={12} style={{
                    display: 'flex',
                    textAlign: 'right',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    gap: "1rem"
                    }}>
                    <Button type="primary" href='/datasets/fetch'>Fetch existing Datasets</Button>
                    <Button type="primary" href='/datasets/new'>New Dataset</Button>
                </Col>
            </Row>

            <Row>
                <Col span={24}>
                    <List
                        bordered
                        dataSource={data}
                        renderItem={(item, index) => (
                            <List.Item
                                // actions={[<a>edit</a>, <a>delete</a>]}
                            >
                                <List.Item.Meta
                                    title={item.name}
                                    description="Standart Dataset"
                                />
                            </List.Item>
                        )}
                    />
                </Col>
            </Row>

        </>
    );
}

export default Datasets;