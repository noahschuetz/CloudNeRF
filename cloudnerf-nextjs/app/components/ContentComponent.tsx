"use client"

import React from 'react';

import InputComponent from './InputComponent';
import ModelComponent from './ModelComponent';

import SceneComponent from './SceneComponent';
import OutputComponent from './OutputComponent';


import  { Layout, Col, Row} from 'antd';
const { Content } = Layout;

const contentStyle = {
    padding: '12px 48px 48px 48px',
    minHeight: 'calc(100vh - 64px)',
    backgroundColor: 'white',
};

const ContentComponent = () => {
    return (
        <Content style={contentStyle}>
        <Row>
            <Col span={12} style={{paddingRight: '24px'}}>
                <InputComponent />
                <ModelComponent />
            </Col>
            <Col span={12} style={{paddingLeft: '24px'}}>
                <SceneComponent />
                <OutputComponent />
            </Col>

        </Row>
        </Content>
    );
}

export default ContentComponent;