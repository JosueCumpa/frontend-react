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
    Switch,
} from '@nextui-org/react';
import { FileAddOutlined, EditOutlined } from '@ant-design/icons';
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { API_BASE_URL } from '../../api/axiosconf.js';
import { useOutletContext } from 'react-router-dom';

export default function EditarTurno({ Turno, type = 'edit', updateTurno }) {
    const [isVisible, setIsVisible] = useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [estado, setEstate] = useState(false);
    const [error, setError] = useState(false);
    const { darkMode } = useOutletContext();

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
        // Configurar el encabezado con el token de acceso
        const tokens = JSON.parse(localStorage.getItem('tokens'));
        const accessToken = tokens?.access;

        const headers = {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        };
        try {
            if (type === 'edit') {
                const url = `${API_BASE_URL}/Turno/${Turno?.id}/`;
                const data = {
                    estado: estado,
                };
                // Agregar el encabezado a la solicitud
                await toast.promise(axios.patch(url, data, { headers }), {
                    loading: 'Actualizando...',
                    success: 'Turno actualizado',
                    error: 'Error al actualizar Turno! Verifique los campos',
                });

            }
            // Luego de editar el usuario, llama a la función de actualización
            updateTurno();
            onClose();

        } catch (error) {
            console.error('Error en la solicitud:', error.message);
        }

    };

    const handleClose = (onClose) => {
        setEstate(false);
        onClose();
    };

    const handleOpen = (onOpen) => {
        if (type == 'edit') {
            setEstate(Turno.estado);
        }
        onOpen();
    };

    return (
        <>
            {type === 'add' ? (
                <Tooltip content="Agregar Turno">
                </Tooltip>
            ) : (
                <Tooltip content="Editar Turno">
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
                                {type === 'add' ? 'Agregar Turno' : 'Editar Turno'}
                            </ModalHeader>
                            <ModalBody>
                                <div className="flex relative flex-col gap-4">
                                    <h1>{Turno.nombre}</h1>
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
