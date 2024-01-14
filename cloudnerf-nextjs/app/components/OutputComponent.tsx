import React from 'react';
import { Divider, Row, Col, Button, Menu } from 'antd';

const OutputComponent = () => {
    return (
        <div style={{minHeight: 'calc(30vh - 64px)'}}>
            <Divider orientation="left" orientationMargin="0">Output</Divider>

            <Menu
                style={{ width: '100%' }}
                defaultSelectedKeys={['instantgnp']}
                defaultOpenKeys={['sub1']}
                mode="horizontal"
            >
                <Menu.Item key="instantngp">Mesh</Menu.Item>
            </Menu>

            <div style={{margin: '12px'}}>

                <Row>
                    <Col span={24}>
                        <Button type="default" block style={{marginTop: '12px'}}>Optimize Mesh</Button>
                    </Col>
                </Row>
                
                <Button type="primary" block style={{marginTop: '16px'}}>Download Mesh</Button>
            
            </div>
            
        </div>
    );
}

export default OutputComponent;