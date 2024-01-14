import React from 'react';

import {Divider, Menu} from 'antd';

import InstantNGP from './models/InstantNGP';

const ModelComponent = () => {

    return (
        <div style={{minHeight: 'calc(30vh - 64px)'}}>

            <Divider orientation="left" orientationMargin="0">Model</Divider>

            <Menu
                style={{ width: '100%' }}
                defaultSelectedKeys={['instantgnp']}
                defaultOpenKeys={['sub1']}
                mode="horizontal"
            >
                <Menu.Item key="instantngp">InstantNGP</Menu.Item>
            </Menu>

            <InstantNGP />

        </div>
    );
}

export default ModelComponent;