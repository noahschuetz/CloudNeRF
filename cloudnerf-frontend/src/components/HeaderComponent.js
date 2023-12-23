import React from 'react';
import  { Layout, Image, Menu } from 'antd';
const { Header } = Layout;

const headerStyle = {
    display: 'flex', 
    alignItems: 'center',
    height: 64,
    paddingInline: 48,
    lineHeight: '64px',
    backgroundColor: 'white',   
};

const menuStyle = {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
};

const menuItems = [
    {
        label: 'Static Scenes',
        key: 'static',
    },
    {
        label: 'Dynamic Scenes',
        key: 'dynamic',
    },
];

const HeaderComponent = () => {
    return (
        <Header style={headerStyle}>
        <Image
          width={40}
          src="https://upload.wikimedia.org/wikipedia/commons/3/30/TU-Berlin-Logo.svg"
          preview={false}
          style={{paddingRight: 16}}
        />
        {/* font size schould be same as <p> */}
        <h1 style={{fontSize: 14, margin: 0}}>CloudNeRF - Evaluating Neural Radiance Fields</h1>
        <Menu
          mode="horizontal"
          defaultSelectedKeys={['static']}
          items={menuItems}
          style={menuStyle}       
        />

      </Header>
    );
};

export default HeaderComponent;
