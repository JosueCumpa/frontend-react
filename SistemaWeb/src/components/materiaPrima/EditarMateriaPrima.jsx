import React from 'react';
import {
    Button,
    Input,
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
import { FileAddOutlined, EditOutlined } from '@ant-design/icons';
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { API_BASE_URL } from '../../api/axiosconf.js';
import { useOutletContext } from 'react-router-dom';

export default function EditarMateriaPrima({ MateriaPrima, type = 'edit', updateMateriaPrima, categorias }) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [estado, setEstate] = useState(false);
    const [error, setError] = useState(false);
    const { darkMode } = useOutletContext();
    // CONTROLES DE CBO LISTA TIPO PRODUCTOS ACTIVOS
    const [selectedCategorias, setSelectedCategorias] = useState([]);

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
        const isnombreValid = validateField(nombre, 'nombre');
        if (!isnombreValid) {
            return;
        } else {
            // Configurar el encabezado con el token de acceso
            const tokens = JSON.parse(localStorage.getItem('tokens'));
            const accessToken = tokens?.access;
            const headers = {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            };
            try {
                if (type === 'edit') {
                    const url = `${API_BASE_URL}/MateriaPrima/${MateriaPrima?.id}/`;
                    const data = {
                        nombre: nombre,
                        descripcion: descripcion,
                        estado: estado,
                        categoria: selectedCategorias.id,
                    };
                    await toast.promise(axios.patch(url, data, { headers }), {
                        loading: 'Actualizando...',
                        success: 'Materia Prima Actualizada correctamente',
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
                updateMateriaPrima();
                onClose();
            } catch (error) {
                console.error('Error en la solicitud:', error.message);
            }
        }
    };

    const handleClose = (onClose) => {
        setNombre('');
        setDescripcion('');
        setEstate(false);
        onClose();
    };

    const handleOpen = (onOpen) => {
        if (type == 'edit') {
            setEstate(MateriaPrima.estado);
            setDescripcion(MateriaPrima.descripcion);
            setNombre(MateriaPrima.nombre);
            const selectedCategorias = categorias.find(
                (categoria) => categoria.id === MateriaPrima.categoria
            );
            setSelectedCategorias(selectedCategorias);
        }
        onOpen();
    };

    // Lista de categorias ACTIVOS
    const handleCategoriasChange = (event) => {
        const selectedCategoriasId = event.target.value;
        // Busca el conductor seleccionado en la lista de conductores
        const selectedCategorias = categorias.find(
            (categoria) => categoria.id === parseInt(selectedCategoriasId)
        );
        // Actualiza la seleccion
        setSelectedCategorias(selectedCategorias);
    };

    return (
        <>
            {type === 'add' ? (
                <Tooltip content="Agregar Usuario">
                </Tooltip>
            ) : (
                <Tooltip content="Editar Materia Prima">
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
                                {type === 'add' ? 'Agregar usuario' : 'Editar Materia Prima'}
                            </ModalHeader>
                            <ModalBody>
                                <div className="flex relative flex-col gap-4">
                                    <Input
                                        label="Nombre"
                                        isInvalid={error}
                                        errorMessage={error && 'Ingrese el nombre correctamente'}
                                        value={nombre}
                                        onChange={(e) => handleNameChange(e, setNombre)}
                                    ></Input>
                                    <Textarea
                                        label="Descripcion"
                                        placeholder="Ingrese la descripción"
                                        value={descripcion}
                                        onChange={(e) => setDescripcion(e.target.value)}
                                    />
                                    {/* Muestra información sobre el conductor seleccionado */}
                                    {selectedCategorias && (
                                        <div>
                                            <p>
                                                Categoria selecionada: {selectedCategorias.nombre}
                                            </p>
                                            {/* Añade más propiedades según la estructura de tu modelo de conductor */}
                                        </div>
                                    )}
                                    <Select
                                        items={categorias}
                                        label="Selecciona una Categoria"
                                        variant="bordered"
                                        defaultSelectedKeys={selectedCategorias.id.toString()}
                                        onChange={handleCategoriasChange}
                                    >
                                        {(categorias) => (
                                            <SelectItem
                                                key={categorias.id}
                                                textValue={`${categorias.nombre}`}
                                            >
                                                <div className="flex gap-2 items-center">
                                                    <span>{categorias.nombre}</span>
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
