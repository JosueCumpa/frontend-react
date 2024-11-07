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
    Select,
    SelectItem,
    Textarea,
    Switch,
} from "@nextui-org/react";
import axios from "axios";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { API_BASE_URL } from "../../api/axiosconf.js";
import { PlusCircleFilled } from '@ant-design/icons';
import { useOutletContext } from 'react-router-dom';

export default function AgregarProducto({ type = "agregar", updateProducto, tipoProductos }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [estate, setEstate] = useState(true);
    const [error, setError] = useState(false);
    const { darkMode } = useOutletContext();
    // CONTROLES DE CBO LISTA TIPO PRODUCTOS ACTIVOS
    const [selectedTProductos, setSelectedTProductos] = useState(null);

    const handleNameChange = (e, fieldSetter) => {
        let value = e.target.value;
        // Restringir caracteres: solo letras y números
        value = value.replace(/[^a-zA-Z0-9Ññ/.]+/g, ' ');
        if (value.length > 150) {
            value = value.substring(0, 150);
        }
        fieldSetter(value);
    };

    const handleSubmit = async () => {
        // Validar campos
        const isnombreValid = validateField(nombre, 'nombre');
        // Verificar si algún campo no es válido
        if (!isnombreValid) {
            return;
        }
        try {
            if (type === 'agregar') {
                // Configurar el encabezado con el token de acceso
                const tokens = JSON.parse(localStorage.getItem('tokens'));
                const accessToken = tokens?.access;
                const headers = {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                };
                const url = `${API_BASE_URL}/Producto/`;
                const data = {
                    nombre: nombre,
                    descripcion: descripcion,
                    estado: estate,
                    tipoPro: selectedTProductos.id,
                };
                // Agregar el encabezado a la solicitud
                await toast.promise(axios.post(url, data, { headers }), {
                    loading: 'Registrando...',
                    success: 'Producto Registrado correctamente',
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
            handlelimpiar();
        } catch (error) {
            console.error('Error en la solicitud:', error.message);
        }
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

    const handlelimpiar = (onClose) => {
        setNombre("");
        setDescripcion("");
        setEstate(true);
        onClose();
    };

    // Lista de PRODDUCTOS ACTIVOS
    const handleTProductosChange = (event) => {
        const selectedTProductoId = event.target.value;
        // Busca el conductor seleccionado en la lista de conductores
        const selectedTProductos = tipoProductos.find(
            (tipoProductos) => tipoProductos.id === parseInt(selectedTProductoId)
        );
        // Actualiza la seleccion
        setSelectedTProductos(selectedTProductos);
    };

    return (
        <>
            {type === "agregar" ? (
                <Tooltip content="Agregar Producto">
                    <Button
                        className="bg-gradient-to-tr from-green-700 to-green-600 text-white text-small shadow-lg"
                        startContent={
                            <PlusCircleFilled className="text-large" />
                        }
                        size="md"
                        onPress={onOpen}
                    >
                        Agregar
                    </Button>
                </Tooltip>
            ) : (
                <Tooltip content="Editar usuario"></Tooltip>
            )}

            <Modal isOpen={isOpen} onClose={onClose} placement="center" style={{
                overflowX: "auto",
            }} className={`${darkMode ? 'dark text-foreground bg-background' : 'light'}`}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                {type === "agregar" ? "Agregar Producto" : "Editar usuario"}
                            </ModalHeader>
                            <ModalBody>
                                <div className="flex relative flex-col gap-4">
                                    <Input
                                        label="Nombre"
                                        isInvalid={error}
                                        errorMessage={error && 'Ingrese el nombre del producto correctamente'}
                                        value={nombre}
                                        onChange={(e) => handleNameChange(e, setNombre)}
                                    ></Input>
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
                                    <Switch defaultSelected={estate} onValueChange={setEstate}>
                                        Estado
                                    </Switch>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="default" variant="light" onClick={onClose}>
                                    Cancelar
                                </Button>

                                <Button color="success" onClick={handleSubmit}>
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
