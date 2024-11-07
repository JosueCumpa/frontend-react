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
    Select,
    SelectItem,
    Card,
    CardHeader,
    CardBody,
    Textarea,
    Divider,
    Switch,
    DatePicker,
} from "@nextui-org/react";
import React from 'react';
import axios from "axios";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { API_BASE_URL } from "../../api/axiosconf.js";
import { PlusCircleFilled } from '@ant-design/icons';
import { useOutletContext } from 'react-router-dom';
import { parseDate, getLocalTimeZone, today } from "@internationalized/date";
import { useDateFormatter } from "@react-aria/i18n";

export default function AgregarPrediccion({ type = "agregar", updatePredicciones, operario, usucalidad, turno, maquina, tproducto, producto, colores, materiaPrima, aditivos }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [value, setValue] = React.useState(today(getLocalTimeZone()));
    const { darkMode } = useOutletContext();
    const [f_fabricacion, setFfabricacion] = useState('');
    const porcentajeAditivo = 0.50; // 5%
    const [ord_fabri, setOrd_fabri] = useState('');
    const [cantidad, setCantidad] = useState('');
    const [cantidadMP, setCantidadMP] = useState('');
    const [longitud, setLongitud] = useState('');
    const [ancho, setAncho] = useState('');
    const [aditivo, setAditivo] = useState('');
    const [merma, setMerma] = useState('');
    const [ciclos, setCiclos] = useState('');
    const [grPrensada, setGrPrensada] = useState('');
    const [moldeMacho, setMoldeMacho] = useState('');
    const [moldeHembra, setMoldeHembra] = useState('');
    const [tempProducto, setTempProducto] = useState('');
    const [tempZona1, setTempZona1] = useState('');
    const [tempZona2, setTempZona2] = useState('');
    const [tempZona3, setTempZona3] = useState('');
    const [tempZona4, setTempZona4] = useState('');
    const [tempZona5, setTempZona5] = useState('');
    const [prediccion, setPrediccion] = useState('');
    const [Recomendacion, setRecomendacion] = useState('');
    const [estate, setEstate] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [error, setError] = useState(false);
    const [resultadosPredicciones, setResultadosPredicciones] = useState([]);
    // CONTROLES DE CBO LISTA 
    const [selectedOperario, setSelectedOperario] = useState([]);
    const [selectedUsucalidad, setSelectedUsucalidad] = useState([]);
    const [selectedTurno, setSelectedTurno] = useState([]);
    const [selectedMaquina, setSelectedMaquina] = useState([]);
    const [selectedTproducto, setSelectedTProducto] = useState([]);
    const [selectedProducto, setSelectedProducto] = useState([]);
    const [filteredProductos, setFilteredProductos] = useState([]);
    const [selectedColor, setSelectedColor] = useState([]);
    const [selectedMateriaPrima, setSelectedMateriaPrima] = useState([]);
    const [selectedAditivo, setSelectedAditivo] = useState([]);
    const [prediccionColor, setPrediccionColor] = useState('black');
    // Definir los estados para las variables de la recomendación
    const [reco_Operario, setReco_Operario] = useState('');
    const [reco_Maquina, setReco_Maquina] = useState('');
    const [reco_Responsable, setReco_Resposable] = useState('');
    const [reco_C_Molde_Macho, setReco_C_Molde_Macho] = useState('');
    const [reco_C_Molde_Hembra, setReco_C_Molde_Hembra] = useState('');
    const [reco_C_Product, setReco_C_Product] = useState('');
    const [reco_Zona_1, setReco_Zona_1] = useState('');
    const [reco_Zona_2, setReco_Zona_2] = useState('');
    const [reco_Zona_3, setReco_Zona_3] = useState('');
    const [reco_Zona_4, setReco_Zona_4] = useState('');
    const [reco_Zona_5, setReco_Zona_5] = useState('');
    const [prediction, setPrediction] = useState('');
    const [Promedioprediction, setPromedioprediction] = useState('');


    const handleNameChange = (e, fieldSetter) => {
        let value = e.target.value;
        // Restringir caracteres: solo letras y números
        value = value.replace(/[^a-zA-Z0-9Ññ-]+/g, ' ');
        if (value.length > 150) {
            value = value.substring(0, 150);
        }
        fieldSetter(value);
    };

    let formatter = useDateFormatter({ dateStyle: "full" });

    const handleChange = (newValue) => {
        setValue(newValue);
        const djangoDate = newValue.toDate(getLocalTimeZone()).toISOString().split("T")[0];
        setFfabricacion(djangoDate); //
        // console.log("Django formatted date:", djangoDate);
    };
    const handleNumerosChange = (e, fieldSetter) => {
        let value = e.target.value;
        // Allow only numbers
        value = value.replace(/[^0-9.]+/g, '');
        fieldSetter(value);
    };

    const handlePrediccion = async () => {
        try {
            const data = {
                Cantidad_Fabric: cantidad,
                Rechaz_No_Ok: 0, // Reemplaza con el valor correcto si es diferente
                Extra_Ok: 0, // Reemplaza con el valor correcto
                Largo: longitud,
                Ancho: ancho,
                MP_KG: cantidadMP,
                Aditi_KG: aditivo,
                Merma_gr: merma,
                Ciclo_seg: ciclos,
                C_Molde_Macho: moldeMacho,
                C_Molde_Hembra: moldeHembra,
                C_Product: tempProducto,
                Peso_gr_prensad: grPrensada,
                Zona_1: tempZona1,
                Zona_2: tempZona2,
                Zona_3: tempZona3,
                Zona_4: tempZona4,
                Zona_5: tempZona5,
                Operario: selectedOperario?.id,
                Responsable: selectedUsucalidad?.id,
                Producto: selectedProducto?.id,
                Tipo: selectedTproducto?.id,
                Color: selectedColor?.id,
                MP_Cod: selectedMateriaPrima?.id,
                Aditivo: selectedAditivo?.id,
                Maquina: selectedMaquina?.id,
                Turno: selectedTurno?.id
            };

            // Realizar la llamada a la API
            await toast.promise(
                axios.post(`${API_BASE_URL}/Prediccion94/`, data),
                {
                    loading: 'Prediciendo...',
                    success: (response) => {
                        const resultados = response.data;  // Aquí recibimos las predicciones en el formato esperado
                        setResultadosPredicciones(resultados);
                        const totalPrediccion = resultados.reduce((acc, pred) => acc + pred.prediction, 0);
                        setPromedioprediction((totalPrediccion / 10).toFixed(1));// Guardamos los resultados en el estado
                        return 'Predicción realizada con éxito';
                    },
                    error: (error) => {
                        console.error('Error en la solicitud:', error.message);
                        return `Error al realizar la predicción: ${error.response?.data?.error || error.message}`;
                    },
                }
            );
        } catch (error) {
            console.error('Error en la solicitud:', error.message);
            toast.error('Error al realizar la predicción');
        }
    };

    // Función para mostrar la tabla de predicciones
    const renderPrediccionesTabla = () => {
        return (
            <div>
                <h5 style={{ width: '100%', textAlign: 'center', borderCollapse: 'collapse' }}>Tabla de Simulacion  ||  Promedio de calidad = {Promedioprediction} </h5>

                <table border="1" style={{ width: '100%', textAlign: 'center', borderCollapse: 'collapse',  backgroundColor: '#e0f7fa', color: '#004d73'}}>
                    <thead>
                        <tr>
                            <th>Pz Rechazadas</th>
                            {/* <th>Rechazados</th> */}
                            {/* <th>Largo</th>
                            <th>Ancho</th> */}
                            {/* <th>Ciclo (seg)</th> */}
                            <th>Molde Macho (°C)</th>
                            <th>Molde Hembra (°C)</th>
                            <th>Producto (°C)</th>
                            <th>Zona 1 (°C)</th>
                            <th>Zona 2 (°C)</th>
                            <th>Zona 3 (°C)</th>
                            <th>Zona 4 (°C)</th>
                            <th>Zona 5 (°C)</th>
                            <th>Calidad (%)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {resultadosPredicciones.map((pred, index) => (
                            <tr key={index}>
                                <td>{pred.input_data[1]}</td>
                                <td>{pred.input_data[9]}</td> {/* C_Molde_Macho */}
                                <td>{pred.input_data[10]}</td> {/* C_Molde_Hembra */}
                                <td>{pred.input_data[11]}</td> {/* C_Product */}
                                <td>{pred.input_data[13]}</td> {/* Zona_1 */}
                                <td>{pred.input_data[14]}</td> {/* Zona_2 */}
                                <td>{pred.input_data[15]}</td> {/* Zona_3 */}
                                <td>{pred.input_data[16]}</td> {/* Zona_4 */}
                                <td>{pred.input_data[17]}</td> {/* Zona_5 */}
                                <td>{pred.prediction.toFixed(1)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };


    // const handleRecomendacion = async () => {
    //     try {
    //         const data = {
    //             Cantidad_Fabric: cantidad,
    //             Rechaz_No_Ok: 21, // Reemplaza con el valor correcto si es diferente
    //             Extra_Ok: 5, // Reemplaza con el valor correcto
    //             Largo: longitud,
    //             Ancho: ancho,
    //             MP_KG: cantidadMP,
    //             Aditi_KG: aditivo,
    //             Merma_gr: merma,
    //             Ciclo_seg: ciclos,
    //             C_Molde_Macho: moldeMacho,
    //             C_Molde_Hembra: moldeHembra,
    //             C_Product: tempProducto,
    //             Peso_gr_prensad: grPrensada,
    //             Zona_1: tempZona1,
    //             Zona_2: tempZona2,
    //             Zona_3: tempZona3,
    //             Zona_4: tempZona4,
    //             Zona_5: tempZona5,
    //             Operario: selectedOperario?.id,
    //             Responsable: selectedUsucalidad?.id,
    //             Producto: selectedProducto?.id,
    //             Tipo: selectedTproducto?.id,
    //             Color: selectedColor?.id,
    //             MP_Cod: selectedMateriaPrima?.id,
    //             Aditivo: selectedAditivo?.id,
    //             Maquina: selectedMaquina?.id,
    //             Turno: selectedTurno?.id,
    //             min_prediction: prediccion,
    //         };

    //         // Realizar la llamada a la API usando axios y toast.promise
    //         await toast.promise(
    //             axios.post(`${API_BASE_URL}/Recomendacion/`, data),
    //             {
    //                 loading: 'Generando recomendación...', // Mensaje de carga
    //                 success: (response) => {
    //                     const recommendationData = response.data.optimal_data;
    //                     const predictionValue = response.data.prediction.toFixed(1); // Redondear a un decimal

    //                     // Actualizar los estados con los valores recibidos
    //                     setReco_Merma_gr(recommendationData.Merma_gr.toFixed(1));
    //                     setReco_Ciclo_seg(recommendationData.Ciclo_seg.toFixed(1));
    //                     setReco_C_Molde_Macho(recommendationData.C_Molde_Macho.toFixed(1));
    //                     setReco_C_Molde_Hembra(recommendationData.C_Molde_Hembra.toFixed(1));
    //                     setReco_C_Product(recommendationData.C_Product.toFixed(1));
    //                     setReco_Peso_gr_prensad(recommendationData.Peso_gr_prensad.toFixed(1));
    //                     setReco_Zona_1(recommendationData.Zona_1.toFixed(1));
    //                     setReco_Zona_2(recommendationData.Zona_2.toFixed(1));
    //                     setReco_Zona_3(recommendationData.Zona_3.toFixed(1));
    //                     setReco_Zona_4(recommendationData.Zona_4.toFixed(1));
    //                     setReco_Zona_5(recommendationData.Zona_5.toFixed(1));
    //                     setPrediction(predictionValue);

    //                     const recommendationString = `Merma (gr):  ${recommendationData.Merma_gr.toFixed(1)},   Ciclo (seg):  ${recommendationData.Ciclo_seg.toFixed(1)},    Peso (gr) prensada:  ${recommendationData.Peso_gr_prensad.toFixed(1)},   T° Molde Macho: ${recommendationData.C_Molde_Macho.toFixed(1)},   T° Molde Hembra:  ${recommendationData.C_Molde_Hembra.toFixed(1)},   T° Producto:  ${recommendationData.C_Product.toFixed(1)},\nT° Zona 1:  ${recommendationData.Zona_1.toFixed(1)},    T° Zona 2:  ${recommendationData.Zona_2.toFixed(1)},    T° Zona 3:  ${recommendationData.Zona_3.toFixed(1)},     T° Zona 4: ${recommendationData.Zona_4.toFixed(1)},    T° Zona 5:  ${recommendationData.Zona_5.toFixed(1)}`;
    //                     // Actualizar el estado Recomendacion con la concatenación
    //                     setRecomendacion(recommendationString);

    //                     return 'Recomendación realizada con éxito'; // Mensaje de éxito
    //                 },
    //                 error: (error) => {
    //                     console.error('No se pudo encontrar una combinación de valores que mantenga la predicción dentro del rango aceptable. en la solicitud:', error.message);
    //                     toast.error('Error al realizar la recomendación');
    //                 },
    //             }
    //         );
    //     } catch (error) {
    //         console.error('Error en la solicitud:', error.message);
    //         toast.error('Error al realizar la recomendación');
    //     }
    // };


    useEffect(() => {
        if (cantidad) {
            const cantidadNumerica = parseFloat(cantidad);
            if (!isNaN(cantidadNumerica)) {
                // Calcula la cantidad de materia prima necesaria usando la fórmula dada
                const cantidadNecesaria = ((cantidadNumerica / 2) * 18) / 1000;
                setCantidadMP(cantidadNecesaria.toFixed(2)); // Ajusta el número de decimales según lo necesario
            }
        }
    }, [cantidad]); // Dependencia en 'cantidad', se ejecutará cuando 'cantidad' cambie

    useEffect(() => {
        if (cantidadMP) {
            const cantidadNumericaMP = parseFloat(cantidadMP);
            if (!isNaN(cantidadNumericaMP) && cantidadNumericaMP >= 2) {
                // Calcula la cantidad de aditivo usando la fórmula basada en porcentaje
                const cantidadNecesariaAditivo = cantidadNumericaMP * porcentajeAditivo;
                //const cantidadMerma = cantidadNumericaMP * 0.3
                setAditivo(cantidadNecesariaAditivo.toFixed(2));
                //setMerma(cantidadMerma.toFixed(2))// Ajusta el número de decimales según lo necesario
            } else {
                setAditivo(1);
            }
        }
    }, [cantidadMP]);
    // Establece la fecha predeterminada en formato Date


    const handleSubmit = async () => {
        // Validar campos
        const isInvalidCantidad = validateField(cantidad, 'Cantidad');
        const islongitudvalid = validateField(longitud, 'Longitud');
        const isCiclo_segValid = validateField(ciclos, 'Ciclo_seg');

        // Verificar si algún campo no es válido
        if (
            !isInvalidCantidad ||
            !islongitudvalid ||
            !isCiclo_segValid
        ) {
            return;
        }

        try {
            // Configurar el encabezado con el token de acceso
            const tokens = JSON.parse(localStorage.getItem('tokens'));
            const accessToken = tokens?.access;

            const headers = {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            };

            // Crear la data para el request de predicción
            const data = {
                cantidad: cantidad,
                operario: selectedOperario?.id,
                res_calidad: selectedUsucalidad?.id,
                turno: selectedTurno?.id,
                maquina: selectedMaquina?.id,
                tipo_producto: selectedTproducto?.id,
                producto: selectedProducto?.id,
                aditivo: selectedAditivo?.id,
                cantidad_mp: cantidadMP,
                cantidad_aditivo: aditivo,
                cantidad_merma: merma,
                largo: longitud,
                ancho: ancho,
                ciclos: ciclos,
                peso_prensada: 400,
                color: selectedColor?.id,
                materia_prima: selectedMateriaPrima?.id,
                prediccion_promedio: Promedioprediction,
            };

            // Enviar la solicitud POST para la predicción principal
            const responsePrediccion = await toast.promise(
                axios.post(`${API_BASE_URL}/Prediccion/`, data, { headers }),
                {
                    loading: 'Registrando predicción...',
                    success: 'Predicción registrada con éxito',
                    error: 'Error al registrar la predicción',
                }
            );

            // Verificar respuesta
            if (responsePrediccion.status === 201) {
                const prediccionId = responsePrediccion.data.id; // Obtener el ID de la predicción creada

                // Ahora, enviar los detalles de la predicción
                const detallesData = resultadosPredicciones.map((pred) => ({
                    prediccion: prediccionId, // Relacionar con la predicción
                    rechazos: pred.input_data[1], // Piezas rechazadas
                    molde_macho: pred.input_data[9],
                    molde_hembra: pred.input_data[10],
                    temp_producto: pred.input_data[11],
                    zona_1: pred.input_data[13],
                    zona_2: pred.input_data[14],
                    zona_3: pred.input_data[15],
                    zona_4: pred.input_data[16],
                    zona_5: pred.input_data[17],
                    calidad: pred.prediction.toFixed(1),
                }));

                // Enviar los detalles utilizando una solicitud para cada uno
                await Promise.all(
                    detallesData.map((detalle) =>
                        axios.post(`${API_BASE_URL}/DetallePrediccion/`, detalle, { headers })
                    )
                );

                // Verificar si valorPrediction tiene un valor antes de registrar la recomendación
                if (prediction) {
                    // Preparar los datos de la recomendación
                    const recomendacionData = {
                        prediccion: prediccionId, // Relacionar con la predicción
                        operario: reco_Operario,
                        responsable: reco_Responsable,
                        maquina: reco_Maquina,
                        temp_molde_macho: reco_C_Molde_Macho,
                        temp_molde_hembra: reco_C_Molde_Hembra,
                        temp_c_producto: reco_C_Product,
                        zona_1: reco_Zona_1,
                        zona_2: reco_Zona_2,
                        zona_3: reco_Zona_3,
                        zona_4: reco_Zona_4,
                        zona_5: reco_Zona_5,
                        valorPrediction: prediction,
                    };

                    // Enviar la solicitud POST para la recomendación
                    await axios.post(`${API_BASE_URL}/RecomendacionV2/`, recomendacionData, { headers });
                }

                toast.success('Predicción, detalles y recomendación registrados con éxito');
                updatePredicciones(); // Actualizar la lista de predicciones si es necesario
                handlelimpiar(); // Limpiar el formulario
                onClose(); // Cerrar el modal
            } else {
                throw new Error('Error al guardar la predicción');
            }
        } catch (error) {
            console.error('Error en la solicitud:', error.message);
            toast.error('Error al registrar la predicción, detalles y recomendación');
        }
    };

    const handleRecomendacion = async () => {
        try {
            const data = {
                Cantidad_Fabric: cantidad,
                Rechaz_No_Ok: 0, // Reemplaza con el valor correcto si es diferente
                Extra_Ok: 0, // Reemplaza con el valor correcto
                Largo: longitud,
                Ancho: ancho,
                MP_KG: cantidadMP,
                Aditi_KG: aditivo,
                Merma_gr: merma,
                Ciclo_seg: ciclos,
                C_Molde_Macho: moldeMacho,
                C_Molde_Hembra: moldeHembra,
                C_Product: tempProducto,
                Peso_gr_prensad: grPrensada,
                Zona_1: tempZona1,
                Zona_2: tempZona2,
                Zona_3: tempZona3,
                Zona_4: tempZona4,
                Zona_5: tempZona5,
                Operario: selectedOperario?.id,
                Responsable: selectedUsucalidad?.id,
                Producto: selectedProducto?.id,
                Tipo: selectedTproducto?.id,
                Color: selectedColor?.id,
                MP_Cod: selectedMateriaPrima?.id,
                Aditivo: selectedAditivo?.id,
                Maquina: selectedMaquina?.id,
                Turno: selectedTurno?.id,
                min_prediction: Promedioprediction
            };
            console.log(data);

            // Realizar la llamada a la API usando axios y toast.promise
            await toast.promise(
                axios.post(`${API_BASE_URL}/Recomendacion/`, data),
                {
                    loading: 'Generando recomendación...', // Mensaje de carga
                    success: (response) => {
                        const { optimal_data, prediction } = response.data;

                        // Aquí puedes extraer los valores que necesitas de optimal_data
                        const { Operario,
                            Responsable,
                            Maquina,
                            C_Molde_Macho,
                            C_Molde_Hembra,
                            C_Product,
                            Zona_1,
                            Zona_2,
                            Zona_3,
                            Zona_4,
                            Zona_5 } = optimal_data;

                        setPrediction(prediction.toFixed(1));
                        setReco_C_Molde_Macho(C_Molde_Macho);
                        setReco_C_Molde_Hembra(C_Molde_Hembra);
                        setReco_Zona_1(Zona_1);
                        setReco_Zona_2(Zona_2);
                        setReco_Zona_3(Zona_3);
                        setReco_Zona_4(Zona_4);
                        setReco_Zona_5(Zona_5);
                        setReco_Operario(Operario);
                        setReco_Resposable(Responsable);
                        setReco_C_Product(C_Product);
                        setReco_Maquina(Maquina);
                        // Formatear los datos en un string legible sin llaves
                        const recommendationString = `Operario: ${Operario},   Responsable: ${Responsable},   Máquina: ${Maquina},   T° M.Macho: ${C_Molde_Macho},  T° Molde Hembra: ${C_Molde_Hembra},   T° Producto: ${C_Product} ,    Zona 1: ${Zona_1},  Zona 2: ${Zona_2},  Zona 3: ${Zona_3},  Zona 4: ${Zona_4},  Zona 5: ${Zona_5} `;

                        // Asignar los valores a las variables de estado correspondientes

                        // Mostrar la recomendación en un campo de texto
                        setRecomendacion(recommendationString.trim()); // `trim` elimina espacios innecesarios al principio y al final

                        return 'Recomendación realizada con éxito'; // Mensaje de éxito
                    },
                    error: (error) => {
                        console.error('Error en la solicitud:', error.message);
                        setRecomendacion('');
                        // Extraer el mensaje de error de la respuesta de la API
                        const errorMessage = error.response?.data?.error || 'Los parametros ya estan optimos';

                        // Mostrar el mensaje de error en el toast
                        toast.error(errorMessage);
                    },
                }
            );
        } catch (error) {
            console.error('Error en la solicitud:', error.message);
            toast.error('Error al realizar la recomendación');
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


    const handlelimpiar = () => {
        setFfabricacion("");
        setOrd_fabri("");
        setCantidad("");
        setLongitud("");
        setAncho("");
        setCantidadMP("");
        setAditivo("");
        setMerma("");
        setCiclos("");
        setMoldeMacho("");
        setMoldeHembra("");
        setTempProducto("");
        setGrPrensada("");
        setTempZona1("");
        setTempZona2("");
        setTempZona3("");
        setTempZona4("");
        setTempZona5("");
        setSelectedOperario(null);
        setSelectedUsucalidad(null);
        setSelectedProducto(null);
        setSelectedTProducto(null);
        setSelectedColor(null);
        setSelectedMateriaPrima(null);
        setSelectedAditivo(null);
        setSelectedMaquina(null);
        setSelectedTurno(null);
        setPrediccion("");
    };

    // Lista de operarios
    const handleOperarioChange = (event) => {
        const selectedOperarioId = event.target.value;
        // Busca el operario seleccionado en la lista de operarios
        const selectedOperario = operario.find(
            (operario) => operario.id === parseInt(selectedOperarioId)
        );
        // Actualiza la seleccion
        setSelectedOperario(selectedOperario);
    };

    // Lista de usu calidad
    const handleCalidadChange = (event) => {
        const selectedUsuCalidadId = event.target.value;
        const selectedCalidad = usucalidad.find(
            (usucalidad) => usucalidad.id === parseInt(selectedUsuCalidadId)
        );
        // Actualiza la seleccion
        setSelectedUsucalidad(selectedCalidad);
    };

    // Lista de turno
    const handleTurnoChange = (event) => {
        const selectedTurnoId = event.target.value;
        const selectedTurno = turno.find(
            (turno) => turno.id === parseInt(selectedTurnoId)
        );
        // Actualiza la seleccion
        setSelectedTurno(selectedTurno);
    };

    // Lista de Maquina
    const handleMaquinaChange = (event) => {
        const selectedMaquinaId = event.target.value;
        const selectedMaquina = maquina.find(
            (maquina) => maquina.id === parseInt(selectedMaquinaId)
        );
        // Actualiza la seleccion
        setSelectedMaquina(selectedMaquina);
    };

    // Lista de tproducto
    const handleTproductoChange = (event) => {
        const selectedTproductoId = event.target.value;
        const selectedTproducto = tproducto.find(
            (tproducto) => tproducto.id === parseInt(selectedTproductoId)
        );
        // Actualiza la seleccion
        setSelectedTProducto(selectedTproducto);
        // Filtrar los productos según el tipo de producto seleccionado
        const filteredProducts = producto.filter(
            (prod) => prod.tipoPro === parseInt(selectedTproductoId)
        );
        setFilteredProductos(filteredProducts);
    };

    // Lista de producto
    const handleProductoChange = (event) => {
        const selectedProductoId = event.target.value;
        const selectedProduct = filteredProductos.find(
            (producto) => producto.id === parseInt(selectedProductoId)
        );
        // Actualiza la seleccion
        setSelectedProducto(selectedProduct);
    };

    // Lista de colores
    const handleColoresChange = (event) => {
        const selectedColoresId = event.target.value;
        const selectedColores = colores.find(
            (colores) => colores.id === parseInt(selectedColoresId)
        );
        // Actualiza la seleccion
        setSelectedColor(selectedColores);
    };

    // Lista de MateriaPrima
    const handleMateriaPrimaChange = (event) => {
        const selectedMPId = event.target.value;
        const selectedMateriaPrima = materiaPrima.find(
            (materiaPrima) => materiaPrima.id === parseInt(selectedMPId)
        );
        // Actualiza la seleccion
        setSelectedMateriaPrima(selectedMateriaPrima);
    };

    // Lista de Aditivos
    const handleAditivosChange = (event) => {
        const selectedAditivoId = event.target.value;
        const selectedAditivos = aditivos.find(
            (aditivos) => aditivos.id === parseInt(selectedAditivoId)
        );
        // Actualiza la seleccion
        setSelectedAditivo(selectedAditivos);
    };
    // Construye la fecha en formato YYYY-MM-DD
    const formatoFecha = (fecha) => {
        const year = fecha.year;
        const month = ('0' + (fecha.month + 1)).slice(-2); // Asegúrate de que month está en el rango 1-12
        const day = ('0' + fecha.day).slice(-2);

        return `${year}-${month}-${day}`;
    };

    // const handleUsarRecomendacion = () => {
    //     setMerma(reco_Merma_gr);
    //     setCiclos(reco_Ciclo_seg);
    //     setGrPrensada(reco_Peso_gr_prensad);
    //     setMoldeMacho(reco_C_Molde_Macho);
    //     setMoldeHembra(reco_C_Molde_Hembra);
    //     setTempProducto(reco_C_Product);
    //     setTempZona1(reco_Zona_1);
    //     setTempZona2(reco_Zona_2);
    //     setTempZona3(reco_Zona_3);
    //     setTempZona4(reco_Zona_4);
    //     setTempZona5(reco_Zona_5);
    //     setPrediccion(prediction)
    //     setPrediction("");
    //     // Ejecuta el método handlePrediccion después de actualizar los estados
    // };


    return (
        <>
            {type === "agregar" ? (
                <Tooltip content="Agregar Prediccion">
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
                <Tooltip content="Editar usuario"></Tooltip>
            )}

            <Modal isOpen={isOpen} onClose={onClose} placement="center" size="5xl" style={{
                overflowX: "auto",
            }} className={`${darkMode ? 'dark text-foreground bg-background' : 'light'}`}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                {type === "agregar" ? "Agregar Prediccion" : "Editar usuario"}
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
                                        <div className="flex relative flex-col gap-1 grid grid-cols-2 sm:grid-cols-3" >
                                            <div className=" flex relative flex-col gap-2">
                                                <DatePicker
                                                    className="max-w"
                                                    label="Fecha"
                                                    value={value}
                                                    onChange={handleChange}
                                                // para que la fecha seleccionada se mantenga en el DatePicker
                                                />

                                                <Input
                                                    label="Cantidad - 100"
                                                    isInvalid={error}
                                                    errorMessage={error && 'Ingrese la cantidad'}
                                                    value={cantidad}
                                                    onChange={(e) => handleNumerosChange(e, setCantidad)}
                                                ></Input>

                                                <Select
                                                    items={operario}
                                                    label="Seleccionar operario"
                                                    variant="bordered"
                                                    onChange={handleOperarioChange}
                                                >
                                                    {(operario) => (
                                                        <SelectItem
                                                            key={operario.id}
                                                            textValue={`${operario.first_name} ${operario.last_name}`}
                                                        >
                                                            <div className="flex gap-2 items-center">
                                                                <span>{operario.first_name} {operario.last_name}</span>

                                                            </div>
                                                        </SelectItem>
                                                    )}
                                                </Select>

                                                <Select
                                                    items={usucalidad}
                                                    label="Seleccionar Res.calidad"
                                                    variant="bordered"
                                                    onChange={handleCalidadChange}
                                                >
                                                    {(usucalidad) => (
                                                        <SelectItem
                                                            key={usucalidad.id}
                                                            textValue={`${usucalidad.first_name} ${usucalidad.last_name}`}
                                                        >
                                                            <div className="flex gap-2 items-center">
                                                                <span>{usucalidad.first_name} {usucalidad.last_name}</span>

                                                            </div>
                                                        </SelectItem>
                                                    )}
                                                </Select>

                                                <Select
                                                    items={turno}
                                                    label="Seleccionar turno"
                                                    variant="bordered"
                                                    onChange={handleTurnoChange}
                                                >
                                                    {(turno) => (
                                                        <SelectItem
                                                            key={turno.id}
                                                            textValue={`${turno.nombre}`}
                                                        >
                                                            <div className="flex gap-2 items-center">
                                                                <span>{turno.nombre}</span>

                                                            </div>
                                                        </SelectItem>
                                                    )}
                                                </Select>

                                                <Select
                                                    items={maquina}
                                                    label="Seleccionar Maquina"
                                                    variant="bordered"
                                                    onChange={handleMaquinaChange}
                                                >
                                                    {(maquina) => (
                                                        <SelectItem
                                                            key={maquina.id}
                                                            textValue={`${maquina.nombre}`}
                                                        >
                                                            <div className="flex gap-2 items-center">
                                                                <span>{maquina.nombre}</span>

                                                            </div>
                                                        </SelectItem>
                                                    )}
                                                </Select>

                                            </div>
                                            <div className=" flex relative flex-col gap-2">
                                                <Select
                                                    items={tproducto}
                                                    label="Seleccionar Tipo producto"
                                                    variant="bordered"
                                                    onChange={handleTproductoChange}
                                                >
                                                    {(tproducto) => (
                                                        <SelectItem
                                                            key={tproducto.id}
                                                            textValue={`${tproducto.nombre}`}
                                                        >
                                                            <div className="flex gap-2 items-center">
                                                                <span>{tproducto.nombre}</span>

                                                            </div>
                                                        </SelectItem>
                                                    )}
                                                </Select>

                                                <Select
                                                    items={filteredProductos}
                                                    label="Seleccionar Producto"
                                                    variant="bordered"
                                                    onChange={handleProductoChange}
                                                >
                                                    {(producto) => (
                                                        <SelectItem
                                                            key={producto.id}
                                                            textValue={`${producto.nombre}`}
                                                        >
                                                            <div className="flex gap-2 items-center">
                                                                <span>{producto.nombre}</span>
                                                            </div>
                                                        </SelectItem>
                                                    )}
                                                </Select>
                                                <Input
                                                    label="Ingrese L(cm) (10-60)"
                                                    isInvalid={error}
                                                    errorMessage={error && 'Ingrese la longitud correctamente'}
                                                    value={longitud}
                                                    onChange={(e) => handleNumerosChange(e, setLongitud)}
                                                ></Input>

                                                <Input
                                                    label="Ingrese A(cm) (1-8)"
                                                    isInvalid={error}
                                                    errorMessage={error && 'Ingrese el ancho correctamente'}
                                                    value={ancho}
                                                    onChange={(e) => handleNumerosChange(e, setAncho)}
                                                ></Input>

                                                <Select
                                                    items={colores}
                                                    label="Seleccionar colores"
                                                    variant="bordered"
                                                    onChange={handleColoresChange}
                                                >
                                                    {(colores) => (
                                                        <SelectItem
                                                            key={colores.id}
                                                            textValue={`${colores.nombre}`}
                                                        >
                                                            <div className="flex gap-2 items-center">
                                                                <span>{colores.nombre}</span>

                                                            </div>
                                                        </SelectItem>
                                                    )}
                                                </Select>

                                                <Select
                                                    items={materiaPrima}
                                                    label="Seleccionar Materia Prima"
                                                    variant="bordered"
                                                    onChange={handleMateriaPrimaChange}
                                                >
                                                    {(materiaPrima) => (
                                                        <SelectItem
                                                            key={materiaPrima.id}
                                                            textValue={`${materiaPrima.nombre}`}
                                                        >
                                                            <div className="flex gap-2 items-center">
                                                                <span>{materiaPrima.nombre}</span>
                                                            </div>
                                                        </SelectItem>
                                                    )}
                                                </Select>

                                            </div>
                                            <div className=" flex relative flex-col gap-2">
                                                <Input
                                                    label="Cantidad MP(KG) (0.5-65)"
                                                    isInvalid={error}
                                                    errorMessage={error && 'Ingrese MP (kg)'}
                                                    value={cantidadMP}
                                                    onChange={(e) => handleNumerosChange(e, setCantidadMP)}
                                                ></Input>
                                                <Select
                                                    items={aditivos}
                                                    label="Seleccionar aditivo"
                                                    variant="bordered"
                                                    onChange={handleAditivosChange}
                                                >
                                                    {(aditivos) => (
                                                        <SelectItem
                                                            key={aditivos.id}
                                                            textValue={`${aditivos.nombre}`}
                                                        >
                                                            <div className="flex gap-2 items-center">
                                                                <span>{aditivos.nombre}</span>

                                                            </div>
                                                        </SelectItem>
                                                    )}
                                                </Select>

                                                <Input
                                                    label="Cantidad Aditivo(KG) (1-7)"
                                                    isInvalid={error}
                                                    errorMessage={error && 'Ingrese Aditivo (kg)'}
                                                    value={aditivo}
                                                    onChange={(e) => handleNumerosChange(e, setAditivo)}
                                                ></Input>

                                                <Input
                                                    label="Cantidad Merma(gr) (1-5)"
                                                    isInvalid={error}
                                                    errorMessage={error && 'Ingrese Merma (gr)'}
                                                    value={merma}
                                                    onChange={(e) => handleNumerosChange(e, setMerma)}
                                                ></Input>

                                                <Input
                                                    label="Ciclos (seg 8-200) "
                                                    isInvalid={error}
                                                    errorMessage={error && 'ingrese corretamente Ciclos (seg)'}
                                                    value={ciclos}
                                                    onChange={(e) => handleNumerosChange(e, setCiclos)}
                                                ></Input>

                                                {/* <Input
                                                    label="Peso (gr) Prensada (8-845)"
                                                    isInvalid={error}
                                                    errorMessage={error && 'ingrese corretamente Peso (gr) Prensada'}
                                                    value={grPrensada}
                                                    onChange={(e) => handleNumerosChange(e, setGrPrensada)}
                                                ></Input> */}
                                            </div>
                                            <Button color="success" onClick={handlePrediccion}>
                                                Predecir
                                            </Button>
                                            {Promedioprediction == "" || Number(Promedioprediction) < 100 && (

                                                <Button color="success" onClick={handleRecomendacion}>
                                                    Recomendacion
                                                </Button>
                                            )}
                                        </div>
                                    </CardBody>
                                </Card>

                                <div>
                                    {/* Renderizar la tabla de predicciones */}

                                    {Recomendacion && (
                                        <div>
                                            <br></br>
                                            <span  className="font-bold" color="success"> Prediccion con los parametros de Recomendacion : {prediction}</span>
                                            <Textarea
                                            isReadOnly
                                                color="success"
                                                label={ <strong>"Se recomienda mantener los siguientes valores para la produccion:" </strong>}
                                                placeholder=" "
                                                value= {Recomendacion}
                                            />

                                            <br></br>
                                        </div>

                                    )}

                                    {resultadosPredicciones.length > 0 && renderPrediccionesTabla()}

                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="default" variant="light" onClick={onClose}>
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
