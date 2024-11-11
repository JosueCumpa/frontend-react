import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import MySidebar from './MySidebar';
import { Layout, theme } from 'antd';
import MenuLogout from '../../assets/code/MenuLogout';
import StatusConnect from '../../assets/code/StatusConnect';

const { Header, Content} = Layout;

const MainContent = () => {
    const [darkMode, setDarkMode] = useState(false);

    const ToggleTheme = () => {
        setDarkMode(!darkMode);
    };

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const headerStyle = {
        display: 'flex',
        justifyContent: 'flex-end',
        background: darkMode ? '#001529' : colorBgContainer, // Color de fondo según el tema
    };

    return (
        <div className={`flex ${darkMode ? 'dark' : ''} bg-background`} style={{ height: '100vh', display: 'flex' }}>
            <MySidebar darkTheme={darkMode} ToggleTheme={ToggleTheme} />
            <Layout style={{ width: '100%', height: '100vh', overflow: "auto" }}>
                <Header style={headerStyle}>
                    <StatusConnect />
                    <MenuLogout />
                </Header>
                <Content
                    style={{
                        margin: '10px 10px',
                        padding: 10,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    <Outlet context={{ darkMode, ToggleTheme }} />
                    {/* <Footer
                    >
                        Todos los Derechos Reservados a Josue Cumpa © {new Date().getFullYear()} .
                    </Footer> */}
                </Content>

            </Layout>
        </div>
    );
};

export default MainContent;
