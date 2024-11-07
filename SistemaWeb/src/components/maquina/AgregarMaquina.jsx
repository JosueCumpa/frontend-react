import {
    Button,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Select,
    SelectItem,
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

export default function AgregarMaquina({ type = "agregar", updateMaquina }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [nombre, setNombre] = useState('');
    const [estate, setEstate] = useState('');
    const [error, setError] = useState(false);
    const { darkMode } = useOutletContext();

    const handleNameChange = (e, fieldSetter) => {
        let value = e.target.value;
        // Restringir caracteres: solo letras y números
        value = value.replace(/[^a-zA-Z0-9-]+/g, ' ');
        if (value.length > 50) {
            value = value.substring(0, 50);
        }
        fieldSetter(value);
    };

    const handleSubmit = async () => {
        // Validar campos
        const isnombreValid = validateField(nombre, 'nombre');
        const isestate = validateField(estate, 'estate');
        // Verificar si algún campo no es válido
        if (!isnombreValid || !isestate) {
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
                const url = `${API_BASE_URL}/Maquina/`;
                const data = {
                    nombre: nombre,
                    estado: estate,
                };
                // Agregar el encabezado a la solicitud
                await toast.promise(axios.post(url, data, { headers }), {
                    loading: 'Registrando...',
                    success: 'Maquina de injeccion Registrada',
                    error: 'Error al registrar Maquina! Verifique los campos',
                });
            }
            // Luego de editar el usuario, llama a la función de actualización
            updateMaquina();
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
        setEstate(false);
        onClose();
    };

    return (
        <>
            {type === 'agregar' ? (
                <Tooltip content="Agregar Maquina">
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
                                {type === 'agregar' ? 'Agregar Maquina' : 'Editar Maquina'}
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
                                    <Select
                                        isRequired
                                        items={estado}
                                        label="Seleccione el estado"
                                        placeholder="Seleccione un estado"

                                        errorMessage={error && 'Seleccione el estado de la maquina'}
                                        onChange={(e) => handleNameChange(e, setEstate)}
                                    >
                                        {(esta) => <SelectItem key={esta.value}>{esta.label}</SelectItem>}
                                    </Select>

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
