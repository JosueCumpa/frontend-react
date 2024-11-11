import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Tooltip,
    useDisclosure,
} from '@nextui-org/react';
import { DeleteOutlined } from '@ant-design/icons';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { useOutletContext } from 'react-router-dom';
import { API_BASE_URL } from '../../api/axiosconf.js';

export default function EliminarTurno({ Turno, type = 'eliminar', updateTurno }) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { darkMode } = useOutletContext();

    const handleDelete = async (turnoid, onClose) => {
        try {
            const url = `${API_BASE_URL}/Turno/${turnoid}/`;
            const tokens = JSON.parse(localStorage.getItem('tokens'));
            const accessToken = tokens?.access;

            // Realizar la solicitud de eliminación con el token en el encabezado
            await axios.delete(url, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            // Actualizar la lista después de la eliminación
            updateTurno();
            // Cerrar el modal
            onClose();
            toast.success("Turno eliminado exitosamente");
        } catch (error) {
            // Manejar errores
            console.error('Error al eliminar Turno:', error.message);
            toast.error("Error al eliminar Turno");
        }
    };
    const handleOpen = (onOpen) => {
        onOpen();
    };

    return (
        <>
            {type === "add" ? (
                <Tooltip content="Agregar Turno">
                    <Button
                        className="bg-transparent"
                        startContent={<DeleteOutlined className="w-6 -m-1 text-default-750" />}
                        size="sm"
                    >
                        Agregar
                    </Button>
                </Tooltip>
            ) : (
                <Tooltip content="Eliminar Turno">
                    <Button
                        color="danger"
                        variant="flat"
                        size="sm"
                        isIconOnly
                        onPress={() => handleOpen(onOpen)}
                    >
                        <DeleteOutlined />
                    </Button>
                </Tooltip>
            )}
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} className={`${darkMode ? 'dark text-foreground bg-background' : 'light'}`}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                Eliminar Turno
                            </ModalHeader>
                            <ModalBody>
                                <p className="text-tiny uppercase font-bold">Estas seguro de eliminar el Turno: {Turno.nombre}?</p>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="default" variant="light" onPress={onClose}>
                                    Cancelar
                                </Button>
                                <Button
                                    color="success"
                                    onPress={() => handleDelete(Turno.id, onClose)}
                                >
                                    Eliminar
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
                <Toaster />
            </Modal>
        </>
    )
}
