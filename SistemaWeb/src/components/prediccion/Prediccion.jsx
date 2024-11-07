import React, { useEffect, useState, useCallback } from 'react';
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
    Input,
    DatePicker,
} from "@nextui-org/react";
import { useAsyncList } from "@react-stately/data";
import { HomeOutlined } from '@ant-design/icons';
import { Breadcrumb } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { parseDate, getLocalTimeZone, today } from "@internationalized/date";
import { useDateFormatter } from "@react-aria/i18n";
import { API_BASE_URL } from '../../api/axiosconf.js';
import AgregarPrediccion from './AgregarPrediccion.jsx';
import DetallePrediccion from './DetallePrediccion.jsx';
import EliminarPrediccion from './EliminarPrediccion.jsx';

// Define el mapa de colores según el valor de la predicción
const statusColorMap = (value) => {
    if (value < 70) return 'danger';  // Color rojo para valores menores a 70
    if (value >= 70 && value <= 85) return 'warning';  // Color amarillo para valores entre 70 y 85
    return 'success';  // Color verde para valores mayores a 85
};

const Prediccion = () => {
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [agregar, setAgregar] = React.useState(true);
    const [f_fabricacion, setFfabricacion] = useState('');
    const [f_fabricacion1, setFfabricacion1] = useState('');
    const [value, setValue] = React.useState(today(getLocalTimeZone()));
    const [value1, setValue1] = React.useState(today(getLocalTimeZone()));
    const rowsPerPage = 9; // ajustar el número de filas por página
    //listado de usuarios (operario o calidad)
    const [operario, setOperario] = useState([]);
    const [calidad, setCalidad] = useState([]);
    const [turno, setTurno] = useState([]);
    const [maquina, setMaquina] = useState([]);
    const [Tproducto, setTproducto] = useState([]);
    const [producto, setProducto] = useState([]);
    const [colores, setColores] = useState([]);
    const [materiaPrima, setMateriaPrima] = useState([]);
    const [aditivos, setAditivos] = useState([]);
    //variables para los filtros
    const [filteredItems, setFilteredItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchOp, setSearchTermOP] = useState("");
    const [searchcali, setSearchTermCali] = useState("");
    const [searchProd, setSearchProdu] = useState("");
    const [selectedTipoProducto, setSelectedTipoProducto] = useState("");
    const user_data = JSON.parse(localStorage.getItem('user_data'));

    //falta poner el array filteritem luego hacer lo de los filtros
    const list = useAsyncList({
        async load({ signal }) {
            try {
                const tokens = JSON.parse(localStorage.getItem('tokens'));
                const res = await axios.get(`${API_BASE_URL}/Prediccion/`, {
                    headers: {
                        Authorization: `Bearer ${tokens.access}`,
                    },
                    signal,
                });
                setIsLoading(false);
                setFilteredItems(res.data);
                return {
                    items: res.data,
                };
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    try {
                        await refreshToken();
                        const refreshedTokens = JSON.parse(localStorage.getItem('tokens'));
                        const refreshedRes = await axios.get(`${API_BASE_URL}/Prediccion/`, {
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


    const updatePredicciones = async () => {
        list.reload();
        //console.log('aca llego');
    };

    // Obtener la cantidad total de elementos
    const totalUsuarios = filteredItems.length;
    // Obtener la cantidad de usuarios activos
    const usuariosActivos = filteredItems.filter(item => item.v_real > 0).length;
    // Obtener la cantidad de usuarios inactivos
    const usuariosInactivos = filteredItems.filter(item => item.v_real <= 0).length;


    const fetchOperario = useCallback(async () => {
        try {
            const tokens = JSON.parse(localStorage.getItem('tokens'));
            const res = await axios.get(`${API_BASE_URL}/usuarios/`, {
                headers: {
                    Authorization: `Bearer ${tokens.access}`,
                },
            });
            const filteredUsers = res.data.filter(user => !user.is_superuser && !user.is_staff && user.is_active);
            const filteredCalidad = res.data.filter(user => !user.is_superuser && user.is_staff && user.is_active);
            setOperario(filteredUsers);
            setCalidad(filteredCalidad);
        } catch (error) {
            console.error('Error al cargar Operarios:', error.message);
        }
    }, []); // Dependencias vacías, se memorizará y no cambiará entre renders

    const fetchTurno = useCallback(async () => {
        try {
            const tokens = JSON.parse(localStorage.getItem('tokens'));
            const res = await axios.get(`${API_BASE_URL}/Turno/`, {
                headers: {
                    Authorization: `Bearer ${tokens.access}`,
                },
            });
            const filteredTurno = res.data.filter(turno => turno.estado);
            setTurno(filteredTurno);
        } catch (error) {
            console.error('Error al cargar Turno:', error.message);
        }
    }, []);

    const fetchMaquina = useCallback(async () => {
        try {
            const tokens = JSON.parse(localStorage.getItem('tokens'));
            const res = await axios.get(`${API_BASE_URL}/Maquina/`, {
                headers: {
                    Authorization: `Bearer ${tokens.access}`,
                },
            });
            const filteredmaquina = res.data.filter(maquina => maquina.estado === 'A');
            setMaquina(filteredmaquina);
        } catch (error) {
            console.error('Error al cargar Maquinas:', error.message);
        }
    }, []);

    // Aplica useCallback de la misma manera a las otras funciones fetch...
    const fetchTproducto = useCallback(async () => {
        try {
            const tokens = JSON.parse(localStorage.getItem('tokens'));
            const res = await axios.get(`${API_BASE_URL}/ListaTproductoActivo/`, {
                headers: {
                    Authorization: `Bearer ${tokens.access}`,
                },
            });
            setTproducto(res.data);
        } catch (error) {
            console.error('Error al cargar tipo de productos:', error.message);
        }
    }, []);

    const fetchProducto = useCallback(async () => {
        try {
            const tokens = JSON.parse(localStorage.getItem('tokens'));
            const res = await axios.get(`${API_BASE_URL}/Producto/`, {
                headers: {
                    Authorization: `Bearer ${tokens.access}`,
                },
            });
            setProducto(res.data);
        } catch (error) {
            console.error('Error al cargar Productos:', error.message);
        }
    }, []);

    const fetchMateriPrima = useCallback(async () => {
        try {
            const tokens = JSON.parse(localStorage.getItem('tokens'));
            const res = await axios.get(`${API_BASE_URL}/MateriaPrima/`, {
                headers: {
                    Authorization: `Bearer ${tokens.access}`,
                },
            });
            const materiasPrimas = res.data;
            const colores = materiasPrimas.filter(item => item.categoria_nombre === 'Color' && item.estado === true);
            const materiaPrima = materiasPrimas.filter(item => item.categoria_nombre === 'Materia Prima' && item.estado === true);
            const aditivos = materiasPrimas.filter(item => item.categoria_nombre === 'Aditivo' && item.estado === true);
            setColores(colores);
            setMateriaPrima(materiaPrima);
            setAditivos(aditivos);
        } catch (error) {
            console.error('Error al cargar Materia Prima:', error.message);
        }
    }, []);

    useEffect(() => {
        fetchOperario();
        fetchTurno();
        fetchMaquina();
        fetchTproducto();
        fetchProducto();
        fetchMateriPrima();
    }, [fetchOperario, fetchTurno, fetchMaquina, fetchTproducto, fetchProducto, fetchMateriPrima]);



    //buscar por usuario o nombre
    const handleSearch = () => {
        const filtered = list.items.filter((item) => {
            return (
                item.operario_nombre.toLowerCase().includes(searchOp.toLowerCase()) &&
                item.res_calidad_nombre.toLowerCase().includes(searchcali.toLowerCase()) &&
                item.producto_nombre.toLowerCase().includes(searchProd.toLocaleLowerCase()) &&
                (!selectedTipoProducto || item.tipo_producto_nombre === selectedTipoProducto) &&
                (!f_fabricacion || item.fecha >= f_fabricacion) && // Filtro de fecha de inicio
                (!f_fabricacion1 || item.fecha <= f_fabricacion1) // Filtro de fecha de fin
            );
        });
        setFilteredItems(filtered);
    };

    useEffect(() => {
        // Establece el valor de user_data.group en searchTerm al cargar el componente
        if (user_data.group == "true") {
            handleSearch();
        } else {
            if (user_data.group === "false" && user_data.op === "false") {
                setSearchTermOP(user_data.name);
                handleSearch();
                console.log(searchOp)
            } else if (user_data.op === "true" && user_data.group === "false") {
                setSearchTermCali(user_data.name);
                handleSearch();
            }
        }

    }, [searchTerm, searchOp, searchcali, searchProd, selectedTipoProducto, user_data]);

    const handleTipoProductoChange = (event) => {
        const selectedTipoProductoId = event.target.value;
        // Buscar el tipo de producto seleccionado en la lista de tipoProductos
        const selectedTproducto = Tproducto.find(
            (Tproductos) => Tproductos.id === parseInt(selectedTipoProductoId)
        );
        // Actualizar el estado con el tipo de producto seleccionado
        setSelectedTipoProducto(selectedTproducto ? selectedTproducto.nombre : "");
        //console.log(selectedTipoProducto)
    };

    const handleChange = (newValue) => {
        setValue(newValue);
        const djangoDate = newValue.toDate(getLocalTimeZone()).toISOString().split("T")[0];
        setFfabricacion(djangoDate); //
        // console.log("Django formatted date:", djangoDate);
    };
    const handleChange2 = (newValue) => {
        setValue1(newValue);
        const djangoDate = newValue.toDate(getLocalTimeZone()).toISOString().split("T")[0];
        setFfabricacion1(djangoDate); //
        // console.log("Django formatted date:", djangoDate);
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
                                <span>Gestion de Predicciones</span>
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
                        <DatePicker
                            label="Fecha Inicio"
                            value={value}
                            onChange={handleChange}
                        // para que la fecha seleccionada se mantenga en el DatePicker
                        />
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="flex gap-3">
                        <DatePicker
                            label="Fecha Fin"
                            value={value1}
                            onChange={handleChange2}
                        // para que la fecha seleccionada se mantenga en el DatePicker
                        />
                    </CardHeader>
                </Card>
            </div>
            {/* filtros para la tabla */}
            <div className="flex relative grid grid-cols-1 sm:grid-cols-5 justify-center gap-0">
                <Card className="custom-card">
                    <CardBody className="flex">
                        <Input
                            clearable
                            underlined
                            type="text"
                            placeholder="Buscar producto"
                            value={searchProd}
                            onChange={(e) => setSearchProdu(e.target.value)}
                        />
                    </CardBody>
                </Card>
                <Card className="custom-card">
                    <CardBody className="flex">
                        <Select
                            label=" "
                            items={Tproducto}
                            placeholder="Buscar Tipo Producto"
                            onChange={handleTipoProductoChange}
                            size=""
                        >
                            {(productos) => (
                                <SelectItem
                                    key={productos.id}
                                    textValue={productos.nombre}
                                >
                                    <div className="flex gap-1 items-center">
                                        <span>{productos.nombre}</span>
                                    </div>
                                </SelectItem>
                            )}
                        </Select>
                    </CardBody>
                </Card>
                {user_data && user_data.group === "true" ? (
                    <Card className="custom-card">
                        <CardBody className="flex">
                            <Input
                                clearable
                                underlined
                                type="text"
                                placeholder="Buscar operario"
                                value={searchOp}
                                onChange={(e) => setSearchTermOP(e.target.value)}
                            />

                        </CardBody>
                    </Card>) : user_data.op === "true" && user_data.group === "false" ? (
                        <Card className="custom-card">
                            <CardBody className="flex">
                                <Input
                                    clearable
                                    underlined
                                    type="text"
                                    placeholder="Buscar operario"
                                    value={searchOp}
                                    onChange={(e) => setSearchTermOP(e.target.value)}
                                />

                            </CardBody>
                        </Card>) : null}
                {user_data && user_data.group === "true" ? (
                    <Card className="custom-card">
                        <CardBody className="flex">
                            <Input
                                clearable
                                underlined
                                type="text"
                                placeholder="Buscar op.calidad"
                                value={searchcali}
                                onChange={(e) => setSearchTermCali(e.target.value)}
                            />
                        </CardBody>
                    </Card>) : user_data.op === "false" && user_data.group === "false" ? (
                        <Card className="custom-card">
                            <CardBody className="flex">
                                <Input
                                    clearable
                                    underlined
                                    type="text"
                                    placeholder="Buscar op.calidad"
                                    value={searchcali}
                                    onChange={(e) => setSearchTermCali(e.target.value)}
                                />
                            </CardBody>
                        </Card>) : null}

                {user_data.op === "true" && user_data.group === "false" || user_data.group === "true" ? (
                    <Card className="custom-card">
                        <CardBody className="flex">
                            {agregar && (
                                <AgregarPrediccion
                                    style={{ paddingTop: '10px' }}
                                    onClose={() => setAgregar(false)}
                                    updatePredicciones={updatePredicciones}
                                    operario={operario}
                                    usucalidad={calidad}
                                    turno={turno}
                                    maquina={maquina}
                                    tproducto={Tproducto}
                                    producto={producto}
                                    colores={colores}
                                    materiaPrima={materiaPrima}
                                    aditivos={aditivos}
                                />
                            )}
                        </CardBody>
                    </Card>
                ) : null}
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
                    aria-label="Predicciones"
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
                        <TableColumn key="Fecha" allowsSorting>
                            Fecha
                        </TableColumn>
                        <TableColumn key="cantidad" allowsSorting>
                            Cantidad
                        </TableColumn>
                        <TableColumn key="operario" allowsSorting>
                            Operario
                        </TableColumn>
                        <TableColumn key="Res.Calidad" allowsSorting>
                            Res.Calidad
                        </TableColumn>
                        <TableColumn key="Producto" allowsSorting>
                            Producto
                        </TableColumn>
                        <TableColumn key="Tipo" allowsSorting>
                            Tipo
                        </TableColumn>
                        <TableColumn key="MP" allowsSorting>
                            Materia Prima
                        </TableColumn>
                        <TableColumn key="aditivo" allowsSorting>
                            Aditivo
                        </TableColumn>
                        <TableColumn key="Maquina" allowsSorting>
                            Maquina
                        </TableColumn>
                        <TableColumn key="Turno" allowsSorting>
                            Turno
                        </TableColumn>
                        <TableColumn key="Calidad" allowsSorting>
                            Prediccion (%)
                        </TableColumn>
                        <TableColumn key="Acciones" allowsSorting>
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
                                    <TableCell>{new Date(item.fecha).toLocaleDateString()}</TableCell>
                                    <TableCell>{item?.cantidad}</TableCell>
                                    <TableCell className='uppercase'>{item?.operario_nombre}</TableCell>
                                    <TableCell className='uppercase'>{item?.res_calidad_nombre}</TableCell>
                                    <TableCell className='uppercase'>{item?.producto_nombre}</TableCell>
                                    <TableCell className='uppercase' >{item?.tipo_producto_nombre}</TableCell>
                                    <TableCell className='uppercase'>{item?.mp_cod_nombre}</TableCell>
                                    <TableCell className='uppercase'>{item?.aditivo_nombre}</TableCell>
                                    <TableCell className='uppercase'>{item?.maquina_nombre}</TableCell>
                                    <TableCell>{item?.turno_nombre}</TableCell>
                                    <TableCell>
                                        <Chip
                                            color={statusColorMap(item?.prediccion_promedio)}
                                            variant="flat"
                                        >
                                            {Number(item?.prediccion_promedio) ? Number(item.prediccion_promedio).toFixed(1) + ' %' : 'N/A'}
                                        </Chip>
                                    </TableCell>
                                    <TableCell className="flex relative gap-3">
                                        <Button
                                            onClick={() => navigate(`/dev/dashboard`, { state: { Prediccion: item } })}
                                            color="primary"
                                        >
                                            Ver Detalles
                                        </Button>
                                        {user_data && user_data.group === "true" ? (
                                            <EliminarPrediccion Prediccion={item} updatePredicciones={updatePredicciones} />
                                        ) : null}
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </Card>
        </div>
    )
}

export default Prediccion
