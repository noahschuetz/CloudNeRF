import React from "react";
import {Button, Col, Row} from 'antd';

const InstantNGP = () => {

    return (

        <div style={{margin: '12px'}}>

            <Row>
                <Col span={12}>
                    <p>Currently using default settings.</p>
                </Col>
                <Col span={12}>
                    <Button type="default" block style={{marginTop: '12px'}}>Change Settings</Button>
                </Col>
            </Row>

            <Button type="primary" block style={{marginTop: '12px'}}>Run InstantNGP</Button>         

        </div>
    );
    
}

export default InstantNGP;