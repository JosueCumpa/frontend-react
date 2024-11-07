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
    Select,
    SelectItem,
    Input
} from "@nextui-org/react";
import { useAsyncList } from "@react-stately/data";
import { HomeOutlined } from '@ant-design/icons';
import { Breadcrumb } from 'antd';
import axios from 'axios';
import { API_BASE_URL } from '../../api/axiosconf.js';
import AgregarProducto from './AgregarProducto.jsx';
import EditarProducto from './EditarProducto.jsx';
import EliminarProducto from './EliminarProducto.jsx';
const statusColorMap = {
    true: "success",
    false: "danger",
    vacation: "warning",
};
const Producto = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [agregar, setAgregar] = React.useState(true);
    const rowsPerPage = 10; // ajustar el número de filas por página
    //variables para los filtros
    const [filteredItems, setFilteredItems] = useState([]);
    const [tipoProductos, setTipoProductos] = useState([]);
    const [selectedTipoProducto, setSelectedTipoProducto] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    useEffect(() => {
        const fetchTipoProductos = async () => {
            try {
                const tokens = JSON.parse(localStorage.getItem('tokens'));
                const res = await axios.get(`${API_BASE_URL}/ListaTproductoActivo/`, {
                    headers: {
                        Authorization: `Bearer ${tokens.access}`,
                    },
                });
                setTipoProductos(res.data);
            } catch (error) {
                console.error('Error al cargar tipos de productos:', error.message);
            }
        };

        fetchTipoProductos();
    }, []);

    const list = useAsyncList({
        async load({ signal }) {
            try {
                const tokens = JSON.parse(localStorage.getItem('tokens'));
                const res = await axios.get(`${API_BASE_URL}/Producto/`, {
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
                        const refreshedRes = await axios.get(`${API_BASE_URL}/Producto/`, {
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

    //buscar por usuario o nombre
    const handleSearch = () => {
        const filtered = list.items.filter((item) => {
            return (
                item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) &&
                (!selectedTipoProducto || item.tipoPro_nombre === selectedTipoProducto) &&
                (statusFilter === "" || item.estado.toString() === statusFilter)
            );
        });
        setFilteredItems(filtered);
    };

    useEffect(() => {
        handleSearch();
    }, [searchTerm, selectedTipoProducto, statusFilter]);

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const updateProducto = async () => {
        list.reload();
    };

    // Obtener la cantidad total de elementos
    const totalTipo = filteredItems.length;
    // Obtener la cantidad de  activos
    const tiposActivos = filteredItems.filter(item => item.estado).length;

    // Obtener la cantidad de  inactivos
    const tiposInactivos = filteredItems.filter(item => !item.estado).length;

    const handleTProductosChange = (event) => {
        const selectedTProductoId = event.target.value;
        // Buscar el tipo de producto seleccionado en la lista de tipoProductos
        const selectedTProducto = tipoProductos.find(
            (tipoProducto) => tipoProducto.id === parseInt(selectedTProductoId)
        );
        // Actualizar el estado con el tipo de producto seleccionado
        setSelectedTipoProducto(selectedTProducto ? selectedTProducto.nombre : "");
        //console.log(selectedTipoProducto)
    };

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
                                <span>Gestion de Productos</span>
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
                        <Input
                            clearable
                            underlined
                            type="text"
                            placeholder="Buscar por nombre"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </CardBody>
                </Card>
                <Card className="custom-card">
                    <CardBody className="flex">
                        <Select
                            label=" "
                            items={tipoProductos}
                            placeholder="Selecciona un Tipo"
                            onChange={handleTProductosChange}
                            size=""
                        >
                            {(tipoProducto) => (
                                <SelectItem
                                    key={tipoProducto.id}
                                    textValue={tipoProducto.nombre}
                                >
                                    <div className="flex gap-1 items-center">
                                        <span>{tipoProducto.nombre}</span>
                                    </div>
                                </SelectItem>
                            )}
                        </Select>
                    </CardBody>
                </Card>
                <Card className="custom-card">
                    <CardBody className="flex">
                        <Select
                            label=" "
                            placeholder="Buscar por estado"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            size=""
                        // defaultSelectedKeys="all"
                        >
                            <SelectItem key="true" value="true">
                                Activo
                            </SelectItem>
                            <SelectItem key="false" value="false">
                                Inactivo
                            </SelectItem>
                        </Select>
                    </CardBody>
                </Card>
                <Card className="custom-card">
                    <CardBody className="flex">
                        {agregar && (
                            <AgregarProducto
                                style={{ paddingTop: "10px" }}
                                onClose={() => setAgregar(false)}
                                updateProducto={updateProducto}
                                tipoProductos={tipoProductos}
                            />)}
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
                    aria-label="Productos"
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
                        <TableColumn key="tipoProducto" allowsSorting>
                            Tipo de Producto
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
                                    <TableCell>{item?.tipoPro_nombre == "" ? "Vacio" : item?.tipoPro_nombre}</TableCell>
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
                                        <EditarProducto Producto={item} updateProducto={updateProducto} tipoProductos={tipoProductos}></EditarProducto>
                                        <EliminarProducto Producto={item} updateProducto={updateProducto}></EliminarProducto>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </Card>
        </div>
    )
}

export default Producto
