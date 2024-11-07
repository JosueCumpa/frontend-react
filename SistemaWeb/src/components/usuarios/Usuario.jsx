import React, { useEffect, useState } from "react";
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
    Input,
    Select,
    SelectSection,
    SelectItem,
    Button,
    CardBody,
} from "@nextui-org/react";
import { useAsyncList } from "@react-stately/data";
import axios from "axios";
import { API_BASE_URL } from "../../api/axiosconf";
import { HomeOutlined } from '@ant-design/icons';
import { Breadcrumb } from 'antd';

import AgregarUsuario from "./AgregarUsuario";
import EditarUsuario from "./EditarUsuario";
import EliminarUsuario from "./EliminarUsuario";

const statusColorMap = {
    true: "success",
    false: "danger",
    vacation: "warning",
};

const statusColorMap2 = {
    true: "success",
    false: "secondary",
};

const Usuario = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [agregar, setAgregar] = React.useState(true);
    const rowsPerPage = 10; // ajustar el número de filas por página
    //cosas los friltros de la tabla
    const [filteredItems, setFilteredItems] = useState([]);
    const [searchTermUsername, setSearchTermUsername] = useState("");
    const [searchTermName, setSearchTermName] = useState("");
    const [statusFilter, setStatusFilter] = useState("");


    const list = useAsyncList({
        async load({ signal }) {
            try {
                const tokens = JSON.parse(localStorage.getItem("tokens"));
                const res = await axios.get(`${API_BASE_URL}/usuarios/`, {
                    headers: {
                        Authorization: `Bearer ${tokens.access}`,
                    },
                    signal,
                });
                setIsLoading(false);
                setFilteredItems(res.data); // Set initial filtered items
                return {
                    items: res.data,
                };
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    try {
                        await refreshToken();
                        const refreshedTokens = JSON.parse(localStorage.getItem("tokens"));
                        const refreshedRes = await axios.get(`${API_BASE_URL}/usuarios/`, {
                            headers: {
                                Authorization: `Bearer ${refreshedTokens.access}`,
                            },
                            signal,
                        });

                        setIsLoading(false);
                        setFilteredItems(refreshedRes.data);
                        return {
                            items: refreshedRes.data,
                        };
                    } catch (refreshError) {
                        console.error(
                            "Error al renovar y cargar datos:",
                            refreshError.message
                        );
                        setIsLoading(false);

                        return {
                            items: [],
                        };
                    }
                } else {
                    console.error("Error al cargar datos:", error.message);
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
                    let cmp =
                        (parseInt(first) || first) < (parseInt(second) || second) ? -1 : 1;

                    if (sortDescriptor.direction === "descending") {
                        cmp *= -1;
                    }

                    return cmp;
                }),
            };
        },
    });

    const refreshToken = async () => {
        try {
            const tokens = JSON.parse(localStorage.getItem("tokens"));
            const refreshRes = await axios.post(
                `${API_BASE_URL}/auth/token/refresh/`,
                {
                    refresh: tokens.refresh,
                }
            );

            const newTokens = {
                ...tokens,
                access: refreshRes.data.access,
            };
            localStorage.setItem("tokens", JSON.stringify(newTokens));
        } catch (refreshError) {
            console.error("Error al renovar el token:", refreshError.message);
        }
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    //buscar por usuario o nombre
    const handleSearch = () => {
        const filtered = list.items.filter((item) => {
            return (
                item.username.toLowerCase().includes(searchTermUsername.toLowerCase()) &&
                item.first_name.toLowerCase().includes(searchTermName.toLowerCase()) &&
                (statusFilter === "" || item.is_active.toString() === statusFilter)
            );
        });
        setFilteredItems(filtered);
    };

    useEffect(() => {
        handleSearch();
    }, [searchTermUsername, searchTermName, statusFilter]);

    const updateUsuarios = async () => {
        list.reload();
        //console.log('aca llego');
    };

    // Obtener la cantidad total de elementos
    const totalUsuarios = filteredItems.length;

    // Obtener la cantidad de usuarios activos
    const usuariosActivos = filteredItems.filter((item) => item.is_active).length;

    // Obtener la cantidad de usuarios inactivos
    const usuariosInactivos = filteredItems.filter((item) => !item.is_active).length;

    // Obtener la cantidad de usuarios administradores
    const usuariosadmin = filteredItems.filter((item) => item.is_superuser).length;

    // Obtener la cantidad de usuarios del area de  calidad
    const usuarioscalidad = filteredItems.filter(item => item.is_staff).length;

    // Obtener la cantidad de usuarios operarios
    const usuariosOperario = filteredItems.filter((item) => !item.is_staff).length;

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
                                <span>Gestion de Usuarios</span>
                            </>
                        ),
                    },

                ]}
            />
            <br></br>

            {/* imagenes y contadores */}
            <div className="flex relative grid grid-cols-2 sm:grid-cols-6 justify-center gap-2 ">
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
                                {totalUsuarios !== null ? (
                                    <span className="text-center">{totalUsuarios} </span>
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
                                {usuariosActivos !== null ? (
                                    <span className="text-center">{usuariosActivos}</span>
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
                                {usuariosInactivos !== null ? (
                                    <span className="text-center"> {usuariosInactivos}</span>
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
                            src="https://cdn-icons-png.flaticon.com/512/2942/2942813.png"
                            width={40}
                        />
                        <div className="flex flex-col">
                            <p className="text-md">N° admins:</p>
                            <p className="text-md">
                                {usuariosadmin !== null ? (
                                    <span className="text-center"> {usuariosadmin}</span>
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
                            src="https://cdn-icons-png.flaticon.com/128/7425/7425445.png"
                            width={40}
                        />
                        <div className="flex flex-col">
                            <p className="text-md">N° Operarios:</p>
                            <p className="text-md">
                                {usuariosadmin !== null ? (
                                    <span className="text-center"> {usuariosOperario}</span>
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
                            src="https://cdn-icons-png.flaticon.com/128/7425/7425445.png"
                            width={40}
                        />
                        <div className="flex flex-col">
                            <p className="text-md">N° Calidad:</p>
                            <p className="text-md">
                                {usuarioscalidad !== null ? (
                                    <span className="text-center"> {usuarioscalidad}</span>
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
                            placeholder="Buscar por usuario"
                            value={searchTermUsername}
                            onChange={(e) => setSearchTermUsername(e.target.value)}
                        />
                    </CardBody>
                </Card>
                <Card className="custom-card">
                    <CardBody className="flex ">
                        <Input
                            clearable
                            underlined
                            type="text"
                            placeholder="Buscar por Nombre"
                            value={searchTermName}
                            onChange={(e) => setSearchTermName(e.target.value)}
                        />
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
                            <SelectItem key="all" value="">
                                Todos
                            </SelectItem>
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
                            <AgregarUsuario
                                style={{ paddingTop: "10px" }}
                                onClose={() => setAgregar(false)}
                                updateUsuarios={updateUsuarios}
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
                    aria-label="USUARIOS"
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
                        <TableColumn key="username" allowsSorting>
                            Usuario
                        </TableColumn>
                        <TableColumn key="is_active" allowsSorting>
                            Estado
                        </TableColumn>
                        <TableColumn key="is_superuser" allowsSorting>
                            Grupo
                        </TableColumn>
                        <TableColumn key="first_name" allowsSorting>
                            Nombre
                        </TableColumn>
                        <TableColumn key="last_name" allowsSorting>
                            Apellido
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
                                <TableRow key={item.id}>
                                    <TableCell>{item.id}</TableCell>
                                    <TableCell>{item.username}</TableCell>
                                    <TableCell>
                                        <Chip
                                            color={statusColorMap[item.is_active]}
                                            variant="flat"
                                            size="sm"
                                        >
                                            {item.is_active ? "Activo" : "Inactivo"}
                                        </Chip>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            className="capitalize"
                                            color={statusColorMap2[item.is_superuser]}
                                            variant="flat"
                                            size="sm"
                                        >
                                            {item?.is_superuser == true && item?.is_staff == false ? " Administrador" : ""}

                                            {item?.is_staff == true && item?.is_superuser == true ? " Administrador y Calidad " : ""}

                                            {item?.is_superuser == false && item?.is_staff == true ? " Calidad " : ""}

                                            {item?.is_superuser == false && item?.is_staff == false ? " Operario " : ""}

                                        </Chip>
                                    </TableCell>
                                    <TableCell>{item.first_name}</TableCell>
                                    <TableCell>{item.last_name}</TableCell>
                                    <TableCell className="flex relative gap-3 ">
                                        <EditarUsuario usuario={item} updateUsuarios={updateUsuarios}></EditarUsuario>
                                        <EliminarUsuario usuario={item} updateUsuarios={updateUsuarios}></EliminarUsuario>
                                    </TableCell>

                                </TableRow>
                            ))}
                    </TableBody>

                </Table>
            </Card>
        </div>
    );
};

export default Usuario