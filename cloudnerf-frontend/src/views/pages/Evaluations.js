import React from 'react';
// import TwoScenes from './ThreeScene';
import {Row, Col, List, Button} from 'antd';
import ThreeScene from './ThreeScene';

function Evaluations() {

    const results = [
        {
            name: "Result 1",
            description: "Description 1",
            url: "http://localhost:5000/results/1"
        },
        {
            name: "Result 2",
            description: "Description 2",
            url: "http://localhost:5000/results/2"
        },
        {
            name: "Result 3",
            description: "Description 3",
            url: "http://localhost:5000/results/3"
        }
    ];

    return (
        <>
            <Row>
                <Col span={24}>
                    <h1>Evaluations</h1>

                    <h3>Results:</h3>                
                    <List 
                        bordered
                        dataSource={results}
                        renderItem={(item, index) => (
                            <List.Item
                                actions={[
                                    <Button type='primary'>Download</Button>,
                                    <Button>View in left panel</Button>,
                                    <Button>View in right panel</Button>			
                                ]}
                            >
                                <List.Item.Meta
                                    title={item.name}
                                    description={item.description}
                                />
                            </List.Item>
                        )}
                    />
                </Col>
            </Row>


            <Row style={{marginTop: "2rem"}}>
                <Col span={24}>
                    <h3>Evaluate results in 3D</h3>
                    <ThreeScene />
                </Col>
            </Row>           

        </>       
    );
}

export default Evaluations;