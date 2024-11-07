import React from 'react';
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
} from '@nextui-org/react';
import { FileAddOutlined, EditOutlined } from '@ant-design/icons';
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { API_BASE_URL } from '../../api/axiosconf.js';
import { useOutletContext } from 'react-router-dom';
import { estado } from '../../assets/code/estado.jsx';

export default function EditarMaquina({ maquina, type = 'edit', updateMaquina }) {
    const [isVisible, setIsVisible] = useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [estate, setEstate] = useState(false);
    const [error, setError] = useState(false);
    const { darkMode } = useOutletContext();

    const handleNameChange = (e, fieldSetter) => {
        let value = e.target.value;
        // Restringir caracteres: solo letras y números
        value = value.replace(/[^a-zA-Z0-9]+/g, ' ');
        if (value.length > 50) {
            value = value.substring(0, 50);
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
        const isestateValid = validateField(estate, 'estate');
        if (!isestateValid) {
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
                    const url = `${API_BASE_URL}/Maquina/${maquina?.id}/`;
                    const data = {
                        estado: estate,
                    };
                    // Agregar el encabezado a la solicitud
                    await toast.promise(axios.patch(url, data, { headers }), {
                        loading: 'Actualizando...',
                        success: 'Maquina de injeccion actualizada',
                        error: 'Error al actualizar Maquina de injeccion! Verifique los campos',
                    });
                }
                // Luego de editar el usuario, llama a la función de actualización
                updateMaquina();
                onClose();

            } catch (error) {
                console.error('Error en la solicitud:', error.message);
            }
        }
    };

    const handleClose = (onClose) => {
        setEstate('')
        onClose();
    };

    const handleOpen = (onOpen) => {
        if (type === 'edit') {
            setEstate(maquina.estado);
        }
        onOpen();
    };

    return (
        <>
            {type === 'add' ? (
                <Tooltip content="Agregar Maquina">
                </Tooltip>
            ) : (
                <Tooltip content="Editar Maquina">
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
                                {type === 'add' ? 'Agregar Maquina' : 'Editar Maquina'}
                            </ModalHeader>
                            <ModalBody>
                                <div className="flex relative flex-col gap-4">
                                    <h1>{maquina.nombre}</h1>
                                    <Select
                                        isRequired
                                        items={estado}
                                        label="Seleccione el estado"
                                        placeholder="Seleccione un estado"
                                        errorMessage={error && 'Seleccione el estado de la maquina'}
                                        defaultSelectedKeys={[estate]}
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
