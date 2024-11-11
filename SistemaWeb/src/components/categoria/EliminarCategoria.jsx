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
import {DeleteOutlined } from '@ant-design/icons';
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { API_BASE_URL } from "../../api/axiosconf";
import { useOutletContext } from 'react-router-dom';

export default function EliminarCategoria({ Categoria, type = 'eliminar', updateCategoria }) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { darkMode } = useOutletContext();

    const handleDelete = async (Categoriaid, onClose) => {
        try {
            const url = `${API_BASE_URL}/Categoria/${Categoriaid}/`;
            const tokens = JSON.parse(localStorage.getItem('tokens'));
            const accessToken = tokens?.access;
            // Realizar la solicitud de eliminación con el token en el encabezado
            await axios.delete(url, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            // Actualizar la lista después de la eliminación
            updateCategoria();
            // Cerrar el modal
            onClose();
            toast.success("Categoria eliminada exitosamente");
        } catch (error) {
            // Manejar errores
            console.error('Error al eliminar la categoria:', error.message);
            toast.error("Error al eliminar la categoria");
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
                <Tooltip content="Eliminar Categoria">
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
                                Eliminar Categoria
                            </ModalHeader>
                            <ModalBody>
                                <p className="text-tiny uppercase font-bold">Estas seguro de eliminar la Categoria: {Categoria.nombre}?</p>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="default" variant="light" onPress={onClose}>
                                    Cancelar
                                </Button>
                                <Button
                                    color="success"
                                    onPress={() => handleDelete(Categoria.id, onClose)}
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
