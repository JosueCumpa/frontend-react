import React, { useEffect, useState } from 'react';
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Spinner,
    Pagination,
    Card,
    CardHeader,
    Chip,
    Image,
    CardBody,
    Button,
} from "@nextui-org/react";
import { useAsyncList } from "@react-stately/data";
import { HomeOutlined } from '@ant-design/icons';
import { Breadcrumb } from 'antd';
import axios from 'axios';
import { API_BASE_URL } from '../../api/axiosconf.js';
import EditarCategoria from './EditarCategoria.jsx';
import EliminarCategoria from './EliminarCategoria.jsx';
const statusColorMap = {
    true: "success",
    false: "danger",
    vacation: "warning",
};

const Categoria = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [agregar, setAgregar] = React.useState(true);
    const rowsPerPage = 10; // ajustar el número de filas por página
    //variables para los filtros
    const [filteredItems, setFilteredItems] = useState([]);

    const list = useAsyncList({
        async load({ signal }) {
            try {
                const tokens = JSON.parse(localStorage.getItem('tokens'));
                const res = await axios.get(`${API_BASE_URL}/Categoria/`, {
                    headers: {
                        Authorization: `Bearer ${tokens.access}`,
                    },
                    signal,
                });
                setIsLoading(false);
                setFilteredItems(res.data)
                return {
                    items: res.data,
                };
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    try {
                        await refreshToken();
                        const refreshedTokens = JSON.parse(localStorage.getItem('tokens'));
                        const refreshedRes = await axios.get(`${API_BASE_URL}/Categoria/`, {
                            headers: {
                                Authorization: `Bearer ${refreshedTokens.access}`,
                            },
                            signal,
                        });
                        setIsLoading(false);
                        setFilteredItems(refreshedRes.data)
                        return {
                            items: refreshedRes.data,
                        };
                    } catch (refreshError) {
                        console.error('Error al renovar y cargar datos:', refreshError.message);
                        setIsLoading(false);
                        return {
                            items: [],
                        };
                    }
                } else {
                    console.error('Error al cargar datos:', error.message);
                    setIsLoading(false);

                    return {
                        items: [],
                    };
                }
            }
        },
        async sort({ items, sortDescriptor }) {
            return {
                items: items.sort((a, b) => {
                    let first = a[sortDescriptor.column];
                    let second = b[sortDescriptor.column];
                    let cmp = (parseInt(first) || first) < (parseInt(second) || second) ? -1 : 1;

                    if (sortDescriptor.direction === 'descending') {
                        cmp *= -1;
                    }

                    return cmp;
                }),
            };
        },
    });

    const refreshToken = async () => {
        try {
            const tokens = JSON.parse(localStorage.getItem('tokens'));
            const refreshRes = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
                refresh: tokens.refresh,
            });

            const newTokens = {
                ...tokens,
                access: refreshRes.data.access,
            };
            localStorage.setItem('tokens', JSON.stringify(newTokens));
        } catch (refreshError) {
            console.error('Error al renovar el token:', refreshError.message);
        }
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const updateCategoria = async () => {
        list.reload();
        //console.log('aca llego');
    };

    // Obtener la cantidad total de elementos
    const totalTipo = filteredItems.length;
    // Obtener la cantidad de  activos
    const tiposActivos = filteredItems.filter(item => item.estado).length;
    // Obtener la cantidad de  inactivos
    const tiposInactivos = filteredItems.filter(item => !item.estado).length;

    return (
        <div className="w-full">
            <Breadcrumb
                items={[
                    {
                        title: <HomeOutlined />,
                    },
                    {
                        title: (
                            <>
                                <span>Gestion de Categorias</span>
                            </>
                        ),
                    },

                ]}
            />
            <br></br>
            {/* imagenes y contadores */}
            <div className="flex relative grid grid-cols-1 sm:grid-cols-3 justify-center gap-2 ">
                <Card>
                    <CardHeader className="flex gap-3">
                        <Image
                            alt="nextui logo"
                            height={40}
                            radius="sm"
                            src="https://cdn-icons-png.flaticon.com/512/2422/2422601.png"
                            width={40}
                        />
                        <div className="flex flex-col ">
                            <p className="text-md">N° registros:</p>
                            <p className="text-md ">
                                {totalTipo !== null ? (
                                    <span className="text-center">{totalTipo} </span>
                                ) : (
                                    <p>Cargando...</p>
                                )}
                            </p>
                        </div>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="flex gap-3">
                        <Image
                            alt="nextui logo"
                            height={40}
                            radius="sm"
                            src="https://static.vecteezy.com/system/resources/previews/017/178/234/original/check-mark-symbol-icon-on-transparent-background-free-png.png"
                            width={40}
                        />
                        <div className="flex flex-col">
                            <p className="text-md">N° activos:</p>
                            <p className="text-md">
                                {tiposActivos !== null ? (
                                    <span className="text-center">{tiposActivos}</span>
                                ) : (
                                    <p>Cargando...</p>
                                )}
                            </p>
                        </div>
                    </CardHeader>
                </Card>

                <Card>
                    <CardHeader className="flex gap-3">
                        <Image
                            alt="nextui logo"
                            height={40}
                            radius="sm"
                            src="https://p9n2c8y2.rocketcdn.me/wp-content/uploads/2021/05/5.png.webp"
                            width={40}
                        />
                        <div className="flex flex-col">
                            <p className="text-md">N° inactivos:</p>
                            <p className="text-md">
                                {tiposInactivos !== null ? (
                                    <span className="text-center"> {tiposInactivos}</span>
                                ) : (
                                    <p>Cargando...</p>
                                )}
                            </p>
                        </div>
                    </CardHeader>
                </Card>
            </div>
            {/* filtros para la tabla */}
            <div className="flex relative grid grid-cols-1 sm:grid-cols-4 justify-center gap-0">
                <Card className="custom-card">
                    <CardBody className="flex">
                        {/* {agregar && (
                            <AgregarTipoProducto
                                style={{ paddingTop: "10px" }}
                                onClose={() => setAgregar(false)}
                                updateTipoProducto={updateTipoProducto}
                            />)} */}
                    </CardBody>
                </Card>
            </div>
            <Card
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    overflowX: "auto",
                }}
            >
                <Table
                    aria-label="Categorias"
                    sortDescriptor={list.sortDescriptor}
                    onSortChange={list.sort}
                    bottomContent={
                        <div className="flex w-full justify-center">
                            <Pagination
                                isCompact
                                showControls
                                total={Math.ceil(filteredItems.length / rowsPerPage)}
                                initialPage={page}
                                onChange={(newPage) => handlePageChange(newPage)}
                            />
                        </div>
                    }
                    classNames={{
                        table: "min-w-[80%]",
                    }}
                >
                    <TableHeader>
                        <TableColumn key="id" allowsSorting>
                            id
                        </TableColumn>
                        <TableColumn key="nombre" allowsSorting>
                            Nombre
                        </TableColumn>
                        <TableColumn key="descripcion" allowsSorting>
                            Descripcion
                        </TableColumn>
                        <TableColumn key="estado" allowsSorting>
                            Estado
                        </TableColumn>
                        <TableColumn key="acciones" allowsSorting>
                            Acciones
                        </TableColumn>
                    </TableHeader>
                    <TableBody
                        items={list.items.slice(
                            (page - 1) * rowsPerPage,
                            page * rowsPerPage
                        )}
                        isLoading={isLoading}
                        loadingContent={<Spinner label="Loading..." />}
                    >
                        {filteredItems
                            .slice((page - 1) * rowsPerPage, page * rowsPerPage)
                            .map((item) => (
                                <TableRow key={item?.id}>
                                    <TableCell>{item?.id}</TableCell>
                                    <TableCell>{item?.nombre}</TableCell>
                                    <TableCell>{item?.descripcion == "" ? "Vacio" : item?.descripcion}</TableCell>
                                    <TableCell>
                                        <Chip
                                            className="capitalize"
                                            color={statusColorMap[item?.estado]}
                                            size="sm"
                                            variant="flat"
                                        >
                                            {item?.estado ? "Activo" : "Inactivo"}
                                        </Chip>
                                    </TableCell>
                                    <TableCell className="flex relative gap-3">
                                        <EditarCategoria Categoria={item} updateCategoria={updateCategoria}></EditarCategoria>
                                        <EliminarCategoria Categoria={item} updateCategoria={updateCategoria}></EliminarCategoria>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </Card>
        </div>
    )
}

export default Categoria
