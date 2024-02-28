import {Layout, Image, Menu} from 'antd';
const {Header} = Layout;

// const navbarClicked = (e) => {
//     window.location.href = e.key;
// };


function Navbar() {
    return (
        <Header style={{color: 'white'}}>
            <Image
                width={48}
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/TU-Berlin-Logo.svg/800px-TU-Berlin-Logo.svg.png"
            />    
            <a href="/" style={{color: 'white'}}><p style={{display: 'inline', marginLeft: '10px'}}>CloudNerf</p></a>

            <Menu 
            theme="dark" 
            mode="horizontal" 
            style={{float: 'right'}}
            // onSelect={navbarClicked}
            >
                <Menu.Item key="1"><a href='/datasets'>Datasets</a></Menu.Item>
                <Menu.Item key="2"><a href='/models'>Models</a></Menu.Item>
                <Menu.Item key="3"><a href='/evaluations'>Evaluations</a></Menu.Item>
            </Menu>

        </Header>
    );
}

export default Navbar;
