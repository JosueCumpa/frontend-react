import React from 'react';
import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Tooltip,
    useDisclosure,
    Textarea,
    Switch,
    Select,
    SelectItem
} from '@nextui-org/react';
import { EditOutlined } from '@ant-design/icons';
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { API_BASE_URL } from '../../api/axiosconf.js';
import { useOutletContext } from 'react-router-dom';

export default function EditarProducto({ Producto, type = 'edit', updateProducto, tipoProductos }) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [descripcion, setDescripcion] = useState('');
    const [estado, setEstate] = useState(false);
    const [error, setError] = useState(false);
    const { darkMode } = useOutletContext();
    // CONTROLES DE CBO LISTA TIPO PRODUCTOS ACTIVOS
    const [selectedTProductos, setSelectedTProductos] = useState([]);

    const handleNameChange = (e, fieldSetter) => {
        let value = e.target.value;
        // Restringir caracteres: solo letras y números
        value = value.replace(/[^a-zA-Z0-9Ññ]+/g, ' ');
        if (value.length > 150) {
            value = value.substring(0, 150);
        }
        fieldSetter(value);
    };

    const validateField = (value, fieldName) => {
        if (value.trim() === '') {
            // Si el campo está vacío, mostrar el mensaje de error
            setError(true);
            toast.error(`Ingrese el ${fieldName} correctamente`);
            return false;
        }
        // Limpiar el mensaje de error si el campo es válido
        setError(false);
        return true;
    };

    const handleSubmit = async (onClose) => {
        // Validar campos
        // Configurar el encabezado con el token de acceso
        const tokens = JSON.parse(localStorage.getItem('tokens'));
        const accessToken = tokens?.access;
        const headers = {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        };
        try {
            if (type === 'edit') {
                const url = `${API_BASE_URL}/Producto/${Producto?.id}/`;
                const data = {
                    descripcion: descripcion,
                    estado: estado,
                    tipoPro: selectedTProductos.id,
                };
                await toast.promise(axios.patch(url, data, { headers }), {
                    loading: 'Actualizando...',
                    success: 'Producto Actualizado correctamente',
                    error: (error) => {
                        if (error.response) {
                            // Devuelve el mensaje de error de la respuesta de la API
                            return error.response.data.non_field_errors || 'Error en la solicitud';
                        } else if (error.request) {
                            return 'No se pudo realizar la solicitud';
                        } else {
                            return 'Error al procesar la solicitud';
                        }
                    }
                });
            }
            // Luego de editar el usuario, llama a la función de actualización
            updateProducto();
            onClose();
        } catch (error) {
            console.error('Error en la solicitud:', error.message);
        }

    };

    const handleClose = (onClose) => {
        setDescripcion('');
        setEstate(false);
        onClose();
    };

    const handleOpen = (onOpen) => {
        if (type == 'edit') {
            setEstate(Producto.estado);
            setDescripcion(Producto.descripcion);
            const selectedTProductos = tipoProductos.find(
                (tipopro) => tipopro.id === Producto.tipoPro
            );
            setSelectedTProductos(selectedTProductos);
        }
        onOpen();
    };

    // Lista de PRODDUCTOS ACTIVOS
    const handleTProductosChange = (event) => {
        const selectedTProductoId = event.target.value;
        // Busca el conductor seleccionado en la lista de conductores
        const selectedTProductos = tipoProductos.find(
            (Tproducto) => Tproducto.id === parseInt(selectedTProductoId)
        );
        // Actualiza la seleccion
        setSelectedTProductos(selectedTProductos);
    };

    return (
        <>
            {type === 'add' ? (
                <Tooltip content="Agregar Usuario">
                </Tooltip>
            ) : (
                <Tooltip content="Editar Producto">
                    <Button
                        color="warning"
                        variant="flat"
                        size="sm"
                        isIconOnly
                        onPress={() => handleOpen(onOpen)}
                    >
                        <EditOutlined />
                    </Button>
                </Tooltip>
            )}
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center" className={`${darkMode ? 'dark text-foreground bg-background' : 'light'}`}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                {type === 'add' ? 'Agregar usuario' : 'Editar Producto'}
                            </ModalHeader>
                            <ModalBody>
                                <div className="flex relative flex-col gap-4">
                                    <h1>{Producto.nombre}</h1>
                                    <Textarea
                                        label="Descripcion"
                                        placeholder="Ingrese la descripción"
                                        value={descripcion}
                                        onChange={(e) => setDescripcion(e.target.value)}
                                    />
                                    <Select
                                        items={tipoProductos}
                                        label="Selecciona un Tipo de producto"
                                        variant="bordered"
                                        defaultSelectedKeys={selectedTProductos.id.toString()}
                                        onChange={handleTProductosChange}
                                    >
                                        {(tipoProductos) => (
                                            <SelectItem
                                                key={tipoProductos.id}
                                                textValue={`${tipoProductos.nombre}`}
                                            >
                                                <div className="flex gap-2 items-center">
                                                    <span>{tipoProductos.nombre}</span>
                                                </div>
                                            </SelectItem>
                                        )}
                                    </Select>
                                    <Switch defaultSelected={estado} onValueChange={setEstate}>
                                        Estado
                                    </Switch>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="default"
                                    variant="light"
                                    onPress={() => handleClose(onClose)}
                                >
                                    Cancelar
                                </Button>
                                <Button color="success" onClick={() => handleSubmit(onClose)}>
                                    Guardar
                                </Button>
                                <Toaster />
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}
