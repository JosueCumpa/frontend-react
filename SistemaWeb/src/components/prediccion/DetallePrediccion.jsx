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
    CardHeader,
    Card,
    CardBody,
    Divider
} from '@nextui-org/react';
import { EyeOutlined } from '@ant-design/icons';
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { API_BASE_URL } from '../../api/axiosconf.js';
import { useOutletContext } from 'react-router-dom';

export default function DetallePrediccion({ Prediccion, type = "edit", updatePredicciones }) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [error, setError] = useState(false);
    const [v_real, setVReal] = useState('');
    const { darkMode } = useOutletContext();


    const handleNumerosChange = (e, fieldSetter) => {
        let value = e.target.value;
        // Allow only numbers
        value = value.replace(/[^0-9.]+/g, '');
        fieldSetter(value);
    };

    const handleSubmit = async (onClose) => {
        // Validar campos

        // Configurar el encabezado con el token de acceso
        const tokens = JSON.parse(localStorage.getItem('tokens'));
        const accessToken = tokens?.access;
        const headers = {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        };
        try {
            if (type === 'edit') {
                const url = `${API_BASE_URL}/Prediccion/${Prediccion?.id}/`;
                const data = {
                    v_real: v_real,
                };
                await toast.promise(axios.patch(url, data, { headers }), {
                    loading: 'Actualizando...',
                    success: 'Valor real de calidad registrada correctamente',
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
            updatePredicciones();
            setVReal('');
            onClose();
        } catch (error) {
            console.error('Error en la solicitud:', error.message);
        }

    };

    const handleClose = (onClose) => {
        setVReal('');
        onClose();
    };

    const handleOpen = (onOpen) => {
        if (type == 'edit') {
            setVReal(Prediccion.v_real);
        }
        onOpen();
    };

    return (
        <>
            {type === 'add' ? (
                <Tooltip content="Agregar Usuario">
                </Tooltip>
            ) : (
                <Tooltip content="Detalle Prediccion">
                    <Button
                        color="warning"
                        variant="flat"
                        size="sm"
                        isIconOnly
                        onPress={() => handleOpen(onOpen)}
                    >
                        <EyeOutlined />
                    </Button>
                </Tooltip>
            )}
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center" size="5xl" className={`${darkMode ? 'dark text-foreground bg-background' : 'light'}`}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                {type === 'add' ? 'Agregar usuario' : 'Detalle Prediccion'}
                            </ModalHeader>
                            <ModalBody>
                                <Card>
                                    <CardHeader className="flex gap-3 justify-center items-center">
                                        <div className="flex flex-col" >
                                            <p className="font-bold text-large">Datos de entrada</p>
                                        </div>
                                    </CardHeader>
                                    <Divider />
                                    <CardBody>
                                        <div className="flex relative flex-col gap-1 grid grid-cols-2 sm:grid-cols-4" >
                                            <div className=" flex relative flex-col gap-2">
                                                <Input
                                                    isDisabled
                                                    label="Fecha Fabricacion"
                                                    value={Prediccion.fecha_produccion}
                                                ></Input>
                                                <Input
                                                    isDisabled
                                                    label="Ord.Fabricacion"
                                                    value={Prediccion.ord_fabri}
                                                ></Input>
                                                <Input
                                                    label="Cantidad"
                                                    isDisabled
                                                    value={Prediccion.cantidad_fabric}
                                                ></Input>
                                                <Input
                                                    label="Operario"
                                                    isDisabled
                                                    value={Prediccion.operario_nombre}
                                                ></Input>
                                                <Input
                                                    label="Res. calidad"
                                                    isDisabled
                                                    value={Prediccion.responsable_nombre}
                                                ></Input>
                                                <Input
                                                    label="Turno"
                                                    isDisabled
                                                    value={Prediccion.turno_nombre}
                                                ></Input>
                                                <Input
                                                    label="Maquina"
                                                    isDisabled
                                                    value={Prediccion.maquina_nombre}
                                                ></Input>

                                            </div>
                                            <div className=" flex relative flex-col gap-2">
                                                <Input
                                                    label="Producto"
                                                    isDisabled
                                                    value={Prediccion.producto_nombre}
                                                ></Input>
                                                <Input
                                                    label="Tipo Producto"
                                                    isDisabled
                                                    value={Prediccion.tipo_nombre}
                                                ></Input>
                                                <Input
                                                    label="L(mm)"
                                                    isDisabled
                                                    value={Prediccion.largo}
                                                ></Input>
                                                <Input
                                                    label="A(mm)"
                                                    isDisabled
                                                    value={Prediccion.ancho}
                                                ></Input>
                                                <Input
                                                    label="Color"
                                                    isDisabled
                                                    value={Prediccion.color_nombre}
                                                ></Input>
                                                <Input
                                                    label="Materia Prima"
                                                    isDisabled
                                                    value={Prediccion.mp_cod_nombre}
                                                ></Input>

                                                <Input
                                                    label="MP(KG)"
                                                    isDisabled
                                                    value={Prediccion.mp_kg}
                                                ></Input>

                                            </div>
                                            <div className=" flex relative flex-col gap-2">
                                                <Input
                                                    label="Aditivo"
                                                    isDisabled
                                                    value={Prediccion.aditivo_nombre}
                                                ></Input>

                                                <Input
                                                    label="Aditivo(KG)"
                                                    isDisabled
                                                    value={Prediccion.aditi_kg}
                                                ></Input>
                                                <Input
                                                    label="Merma(gr)"
                                                    isDisabled
                                                    value={Prediccion.merma_gr}
                                                ></Input>
                                                <Input
                                                    label="Ciclos (seg) "
                                                    isDisabled
                                                    value={Prediccion.ciclo_seg}
                                                ></Input>
                                                <Input
                                                    label="Peso (gr) Prensada"
                                                    isDisabled
                                                    value={Prediccion.peso_gr_prensad}
                                                ></Input>

                                                <Input
                                                    label="T° molde macho"
                                                    isDisabled
                                                    value={Prediccion.c_molde_macho}
                                                ></Input>

                                                <Input
                                                    label="T° molde Hembra"
                                                    isDisabled
                                                    value={Prediccion.c_molde_macho}
                                                ></Input>

                                            </div>
                                            <div className=" flex relative flex-col gap-2">
                                                <Input
                                                    label="T° Producto"
                                                    isDisabled
                                                    value={Prediccion.c_product}
                                                ></Input>
                                                <Input
                                                    label="T° Zona1"
                                                    isDisabled
                                                    value={Prediccion.zona_1}
                                                ></Input>
                                                <Input
                                                    label="T° Zona2 "
                                                    isDisabled
                                                    value={Prediccion.zona_2}
                                                ></Input>
                                                <Input
                                                    label="T° Zona3"
                                                    isDisabled
                                                    value={Prediccion.zona_3}
                                                ></Input>
                                                <Input
                                                    label="T° Zona4 "
                                                    isDisabled
                                                    value={Prediccion.zona_4}
                                                ></Input>
                                                <Input
                                                    label="T° Zona5 "
                                                    isDisabled
                                                    value={Prediccion.zona_5}
                                                ></Input>
                                                <Input
                                                    label="Prediccion"
                                                    isDisabled
                                                    value={Prediccion.prediccion}
                                                ></Input>

                                            </div>

                                        </div>
                                        <Divider style={{ marginBottom: "0.5rem" }} />
                                        <div className="flex relative flex-col gap-2">
                                            <p className="text-tiny uppercase font-bold" >Ingrese la calidad (%) real obtenida: </p>
                                            <Input
                                                label="Calidad real"
                                                isInvalid={error}
                                                size='sm'
                                                value={v_real}
                                                onChange={(e) => handleNumerosChange(e, setVReal)}
                                            ></Input>
                                        </div>
                                    </CardBody>

                                </Card>
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
