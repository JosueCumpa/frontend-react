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
} from "@nextui-org/react";
import { DeleteOutlined } from '@ant-design/icons';
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { API_BASE_URL } from "../../api/axiosconf";
import { useOutletContext } from 'react-router-dom';

export default function EliminarPrediccion({ Prediccion, type = "eliminar", updatePredicciones }) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { darkMode } = useOutletContext();

    const handleDelete = async (Prediccionid, onClose) => {
        try {
            const url = `${API_BASE_URL}/Prediccion/${Prediccionid}/`;
            const tokens = JSON.parse(localStorage.getItem('tokens'));
            const accessToken = tokens?.access;
            // Realizar la solicitud de eliminación con el token en el encabezado
            await axios.delete(url, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            // Actualizar la lista después de la eliminación
            updatePredicciones();
            // Cerrar el modal
            onClose();
            toast.success("Prediccion eliminada exitosamente");
        } catch (error) {
            // Manejar errores
            console.error('Error al eliminar la prediccion:', error.message);
            toast.error("Error al eliminar la prediccion");
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
                <Tooltip content="Eliminar Prediccion">
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
                                Eliminar Prediccion
                            </ModalHeader>
                            <ModalBody>
                                <p className="text-tiny uppercase" style={{ fontSize: '1rem' }} >Estas seguro de eliminar la Prediccion: </p>
                                <p className="text-tiny uppercase font-bold" style={{ fontSize: '1rem' }}>{Prediccion.id} - {Prediccion.producto_nombre} - {Prediccion.tipo_producto_nombre}?</p>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="default" variant="light" onPress={onClose}>
                                    Cancelar
                                </Button>
                                <Button
                                    color="success"
                                    onPress={() => handleDelete(Prediccion.id, onClose)}
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
