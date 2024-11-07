import { useState, useEffect } from 'react';
import { Button, Layout, theme } from 'antd';
// import Logo from '../../assets/code/logo';
import Logito from '../../assets/image/logito.png'
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import MenuList from './MenuList';
import ToggleThemeButton from '../../assets/code/ToggleThemeButton';
import { Image } from '@nextui-org/react'


const { Header, Sider } = Layout;

export default function MySidebar({ darkTheme, ToggleTheme }) {
    const [collapsed, setCollapsed] = useState(false);



    const handleResize = () => {
        if (window.innerWidth < 1080) {
            setCollapsed(true);
        } else {
            setCollapsed(false);
        }
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    return (
        <Layout>
            <Sider
                collapsed={collapsed}
                collapsible
                trigger={null}
                className='sidebar'
                theme={darkTheme ? 'dark' : 'light'}
            >
                <Image
                    className="m-5 opacity-100"
                    alt="Logo dev"
                    src={Logito}
                    width='83%'
                />
                <MenuList darkTheme={darkTheme} />
                <ToggleThemeButton darkTheme={darkTheme} ToggleTheme={ToggleTheme} />
            </Sider>
            <Layout>
                <Header style={{ padding: 0, background: colorBgContainer }}>

                    <Button
                        type='text'
                        className='toggle'
                        onClick={() => setCollapsed(!collapsed)}
                        icon={
                            collapsed ? (
                                <MenuUnfoldOutlined style={{ color: darkTheme ? 'white' : 'black' }} />
                            ) : (
                                <MenuFoldOutlined style={{ color: darkTheme ? 'white' : 'black' }} />
                            )
                        }
                    />

                </Header>
            </Layout>
        </Layout>
    );
}