import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
// import TwoScenes from './ThreeScene';
import {Row, Col, List, Button} from 'antd';
import ThreeScene from './ThreeScene';

import { useGetResultsQuery} from '../../redux/api';

function Evaluations() {

    const { data: results, error, isLoading } = useGetResultsQuery();


    const [leftSceneMeshUrl, setLeftSceneMeshUrl] = useState("");
    const [rightSceneMeshUrl, setRightSceneMeshUrl] = useState("");
    const handleDownloadClick = (name) => {

        // http://localhost:5000/results/${name}/meshUrl provides the mesh url
        fetch(`http://localhost:5000/results/${name}/meshUrl`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            const url = data.signedUrl;

            const a = document.createElement('a');
            a.href = url;
            document.body.appendChild(a);
            a.click();
            a.remove();

        })

    }
    const handleViewInLeftPanel = (name) => {

        // http://localhost:5000/results/${name}/meshUrl provides the mesh url
        fetch(`http://localhost:5000/results/${name}/meshUrl`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {

            console.log(data);
            const url = data.signedUrl;

            setLeftSceneMeshUrl(url);
            
            /// Render ThreeScene component with meshurl as prop and append to three-scene-container
            const scene = <ThreeScene meshurl = {url} />;
            const container = document.getElementById('three-scene-container');

            // Ensure that container is not null before attempting to append
            if (container) {
            ReactDOM.render(scene, container);
            } else {
            console.error("Container element not found.");
            }

        })

    }
    const handleViewInRightPanel = (name) => {

        // http://localhost:5000/results/${name}/meshUrl provides the mesh url
        fetch(`http://localhost:5000/results/${name}/meshUrl`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const url = data.signedUrl;

            setRightSceneMeshUrl(url);     
            
            

        })

    }

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
                                    <Button 
                                        type='primary'
                                        onClick={() => handleDownloadClick(item.name)}
                                        
                                    >Download</Button>,
                                    <Button
                                        type='primary'
                                        onClick={() => handleViewInLeftPanel(item.name)}
                                    >View in left panel</Button>,
                                    <Button
                                        type='primary'
                                        onClick={() => handleViewInRightPanel(item.name)}
                                    >View in right panel</Button>			
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

                    <div id='three-scene-container'>
                    </div>
                    


                    
                </Col>
            </Row>           

        </>       
    );
}

export default Evaluations;