import {
    Button,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Textarea,
    Switch,
    Tooltip,
    useDisclosure,
} from "@nextui-org/react";
import axios from "axios";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { API_BASE_URL } from "../../api/axiosconf.js";
import { PlusCircleFilled } from '@ant-design/icons';
import { useOutletContext } from 'react-router-dom';
import { estado } from '../../assets/code/estado.jsx';

export default function AgregarTipoProducto({ type = "agregar", updateTipoProducto }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [estate, setEstate] = useState(false);
    const [error, setError] = useState(false);
    const { darkMode } = useOutletContext();

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
                const url = `${API_BASE_URL}/TipoProducto/`;
                const data = {
                    nombre: nombre,
                    descripcion: descripcion,
                    estado: estate,
                };
                // Agregar el encabezado a la solicitud
                await toast.promise(axios.post(url, data, { headers }), {
                    loading: 'Registrando...',
                    success: 'Tipo de Producto Registrado',
                    error: 'Error al registrar Tipo de Producto! Verifique los campos',
                });
            }
            // Luego de editar el usuario, llama a la función de actualización
            updateTipoProducto();
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
        setEstate(false);
        onClose();
    };

    return (
        <>
            {type === 'agregar' ? (
                <Tooltip content="Agregar Tipo de Producto">
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
                <Tooltip content="Editar Maquina">
                </Tooltip>
            )}

            <Modal isOpen={isOpen} onClose={onClose} placement="center" className={`${darkMode ? 'dark text-foreground bg-background' : 'light'}`}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                {type === 'agregar' ? 'Agregar Tipo de Producto' : ''}
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
                                    <Switch defaultSelected={estate} onValueChange={setEstate}>
                                        Estado
                                    </Switch>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="default"
                                    variant="light"
                                    onClick={onClose}
                                >
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