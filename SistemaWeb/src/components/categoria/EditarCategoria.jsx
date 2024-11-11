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
} from '@nextui-org/react';
import { EditOutlined } from '@ant-design/icons';
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { API_BASE_URL } from '../../api/axiosconf.js';
import { useOutletContext } from 'react-router-dom';

export default function EditarCategoria({ Categoria, type = 'edit', updateCategoria }) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [descripcion, setDescripcion] = useState('');
    const [estado, setEstate] = useState(false);
    const { darkMode } = useOutletContext();

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
                const url = `${API_BASE_URL}/Categoria/${Categoria?.id}/`;
                const data = {
                    descripcion: descripcion,
                    estado: estado,
                };
                // Agregar el encabezado a la solicitud
                await toast.promise(axios.patch(url, data, { headers }), {
                    loading: 'Actualizando...',
                    success: 'Categoria actualizada',
                    error: 'Error al actualizar la categoria! Verifique los campos',
                });
            }
            // Luego de editar el usuario, llama a la función de actualización
            updateCategoria();
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
            setEstate(Categoria.estado);
            setDescripcion(Categoria.descripcion);
        }
        onOpen();
    };

    return (
        <>
            {type === 'add' ? (
                <Tooltip content="Agregar Maquina">
                </Tooltip>
            ) : (
                <Tooltip content="Editar Categoria">
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
                                {type === 'add' ? '' : 'Editar Categoria'}
                            </ModalHeader>
                            <ModalBody>
                                <div className="flex relative flex-col gap-4">
                                    <h1>{Categoria.nombre}</h1>
                                    <Textarea
                                        label="Descripcion"
                                        placeholder="Ingrese la descripción"
                                        value={descripcion}
                                        onChange={(e) => setDescripcion(e.target.value)}
                                    />
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
