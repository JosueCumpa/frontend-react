import { Menu } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import { HomeOutlined, UserAddOutlined, TruckOutlined, TableOutlined, GoldOutlined, OrderedListOutlined, ProductOutlined, BarcodeOutlined, FundProjectionScreenOutlined } from '@ant-design/icons';

const MenuList = ({ darkTheme }) => {
    const user_data = JSON.parse(localStorage.getItem('user_data'));

    const items = [
        {
            key: 'home',
            icon: <HomeOutlined />,
            label: <Link to="/dev/dashboard">Dashboard</Link>,
            condition: user_data.group === "false" && user_data.op === "true" || user_data.group === "true" || user_data.group === "false" && user_data.op === "false"
        },
        {
            key: 'user',
            icon: <UserAddOutlined />,
            label: <Link to="/dev/usuarios">Usuarios</Link>,
            condition: user_data.group === "true" && user_data.op === "true"
        },
        {
            key: 'turno',
            icon: <TableOutlined />,
            label: <Link to="/dev/turno">Turno</Link>,
            condition: user_data.group === "true"
        },
        {
            key: 'maquina',
            icon: <TruckOutlined />,
            label: <Link to="/dev/maquinas">Maquina</Link>,
            condition: user_data.group === "true"
        },
        {
            key: 'TipoProducto',
            icon: <GoldOutlined />,
            label: <Link to="/dev/tipoProducto">Tipo Producto</Link>,
            condition: user_data.group === "true"
        },
        {
            key: 'Categoria',
            icon: <OrderedListOutlined />,
            label: <Link to="/dev/categoria">Categoria</Link>,
            condition: user_data.group === "true"
        },
        {
            key: 'Producto',
            icon: <ProductOutlined />,
            label: <Link to="/dev/producto">Producto</Link>,
            condition: user_data.group === "true"
        },
        {
            key: 'MateriaPrima',
            icon: <BarcodeOutlined />,
            label: <Link to="/dev/materiaprima">Materia Prima</Link>,
            condition: user_data.group === "true"
        },
        {
            key: 'Prediccion',
            icon: <FundProjectionScreenOutlined />,
            label: <Link to="/dev/prediccion">Prediccion</Link>,
            condition: user_data.group === "false" && user_data.op === "true" || user_data.group === "true" || user_data.group === "false" && user_data.op === "false"
        },
    ];
    const filteredItems = items.filter(item => item.condition).map(({ condition, ...item }) => item);
    return (
        <Menu
            theme={darkTheme ? 'dark' : 'light'}
            mode='inline'
            className='menu-bar'
            items={filteredItems}
        />
    );
}

export default MenuList;