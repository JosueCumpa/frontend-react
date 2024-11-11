import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Tooltip,
    useDisclosure,
} from "@nextui-org/react";
import { DeleteOutlined } from '@ant-design/icons';
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { API_BASE_URL } from "../../api/axiosconf";
import { useOutletContext } from 'react-router-dom';

export default function EliminarTipoProducto({ tipoProducto, type = 'eliminar', updateTipoProducto }) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { darkMode } = useOutletContext();

    const handleDelete = async (tipoProductoid, onClose) => {
        try {
            const url = `${API_BASE_URL}/TipoProducto/${tipoProductoid}/`;
            const tokens = JSON.parse(localStorage.getItem('tokens'));
            const accessToken = tokens?.access;

            // Realizar la solicitud de eliminación con el token en el encabezado
            await axios.delete(url, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            // Actualizar la lista después de la eliminación
            updateTipoProducto();
            // Cerrar el modal
            onClose();
            toast.success("Tipo de producto eliminado exitosamente");
        } catch (error) {
            // Manejar errores
            console.error('Error al eliminar Tipo de producto:', error.message);
            toast.error("Error al eliminar Tipo de Producto");
        }
    };

    const handleOpen = (onOpen) => {
        onOpen();
    };
    return (
        <>
            {type === "add" ? (
                <Tooltip content="Agregar maquina">
                </Tooltip>
            ) : (
                <Tooltip content="Eliminar Tipo de Producto">
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
                                Eliminar Tipo de Producto
                            </ModalHeader>
                            <ModalBody>
                                <p className="text-tiny uppercase font-bold">Estas seguro de eliminar al Tipo de Producto: {tipoProducto.nombre}?</p>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="default" variant="light" onPress={onClose}>
                                    Cancelar
                                </Button>
                                <Button
                                    color="success"
                                    onPress={() => handleDelete(tipoProducto.id, onClose)}
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
