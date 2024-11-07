import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { HomeOutlined } from '@ant-design/icons';
import { Breadcrumb } from 'antd';
import {
    Card,
    CardBody,
    CardHeader,
    Select,
    SelectItem,
    Input
} from "@nextui-org/react";
import { LineChart, DonutChart, Legend, BarChart } from '@tremor/react';
import axios from 'axios';
import { API_BASE_URL } from '../../api/axiosconf.js';

const valueFormatter = (number) =>
    `Piezas ${Intl.NumberFormat('us').format(number).toString()}`;

export default function Dashboard() {
    const location = useLocation();
    const prediccion = location.state?.Prediccion || {};
    const [recomendacion, setRecomendacion] = useState({});
    const [chartData, setChartData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [minMaxValues, setMinMaxValues] = useState({});

    useEffect(() => {
        const fetchDetalles = async () => {
            try {
                const tokens = JSON.parse(localStorage.getItem('tokens'));
                const accessToken = tokens?.access;

                if (!accessToken) {
                    throw new Error('No se encontró el token de acceso');
                }

                const response = await axios.get(`${API_BASE_URL}/detalles-prediccion/${prediccion.id}/`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                setLoading(false);

                // Variables que queremos graficar
                const variables = ['calidad', 'molde_macho', 'molde_hembra', 'temp_producto', 'zona_1', 'zona_2', 'zona_3', 'zona_4', 'zona_5'];
                const formattedData = {};
                const minMax = {};

                variables.forEach((variable) => {
                    const data = response.data.map((detalle, index) => ({
                        iteration: `Iteración ${index + 1}`,
                        value: parseFloat(detalle[variable]),
                    }));

                    // Calcular el valor mínimo y máximo para cada variable
                    const values = data.map(item => item.value);
                    const minValue = Math.min(...values);
                    const maxValue = Math.max(...values);

                    formattedData[variable] = data;
                    minMax[variable] = { min: minValue, max: maxValue };
                });

                setChartData(formattedData);
                setMinMaxValues(minMax);

            } catch (error) {
                console.error('Error al cargar los detalles de la predicción:', error.message);
                setError('Error al cargar los detalles de la predicción.');
                setLoading(false);
            }
        };

        if (prediccion.id) {
            fetchDetalles();
        }
    }, [prediccion.id]);

    useEffect(() => {
        const fetchRecomendacion = async () => {
            try {
                const tokens = JSON.parse(localStorage.getItem('tokens'));
                const accessToken = tokens?.access;

                if (!accessToken) {
                    throw new Error('No se encontró el token de acceso');
                }

                const response = await axios.get(`${API_BASE_URL}/Recomendacionid/${prediccion.id}/`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                if (response.data.length > 0) {
                    setRecomendacion(response.data[0]);
                }
            } catch (error) {
                console.error('Error al cargar la recomendación:', error.message);
            }
        };

        if (prediccion.id) {
            fetchRecomendacion();
        }
    }, [prediccion.id]);


    if (loading) {
        return <div>Cargando...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    const dataFormatter = (number) =>
        Intl.NumberFormat('us').format(number).toString();

    const renderLineChart = (title, dataKey, Recomen) => (
        <Card className='mb-4'>
            <CardBody>
                <h3 className="text-md font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                    {title} (Mínimo: {minMaxValues[dataKey]?.min}, Máximo: {minMaxValues[dataKey]?.max}, Recomendación: {Recomen})
                </h3>
                <LineChart
                    index="iteration"
                    data={chartData[dataKey]}
                    yAxisWidth={30}
                    categories={['value']}
                    colors={['blue']}
                    // intervalType={"preserveStartEnd"}
                    
                />
            </CardBody>
        </Card>
    );
    return (
        <div className="w-full">
            <Breadcrumb
                items={[
                    {
                        title: <HomeOutlined />,
                    },
                    {
                        title: (
                            <>
                                <span>Dashboard</span>
                            </>
                        ),
                    },
                ]}
            />
            <br></br>
            <Card className="mb-4">
                <CardBody >
                    <h3 className="text-md font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                        Detalles de la Predicción ID :  {prediccion.id}
                       
                    </h3>
                    <br></br>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                        <Input
                            color='primary'
                            label="Fecha"
                            value={new Date(prediccion.fecha).toLocaleDateString()}
                            readOnly
                            errorMessage={false}
                        />
                        <Input
                        color='primary'
                            label="Tipo de Producto"
                            value={prediccion.tipo_producto_nombre}
                            readOnly
                            errorMessage={false}
                        />
                        <Input
                        color='primary'
                            label="Producto"
                            value={prediccion.producto_nombre}
                            readOnly
                            errorMessage={false}
                        />
                        <Input
                        color='primary'
                            label="Cantidad"
                            value={prediccion.cantidad}
                            readOnly
                            errorMessage={false}
                        />
                        <Input
                        color='primary'
                            label="Operario"
                            value={prediccion.operario_nombre}
                            readOnly
                            errorMessage={false}
                        />
                        <Input
                        color='primary'
                            label="Responsable de Calidad"
                            value={prediccion.res_calidad_nombre}
                            readOnly
                            errorMessage={false}
                        />
                        <Input
                        color='primary'
                            label="Turno"
                            value={prediccion.turno_nombre}
                            readOnly
                            errorMessage={false}
                        />
                        <Input
                        color='primary'
                            label="Máquina"
                            value={prediccion.maquina_nombre}
                            readOnly
                            errorMessage={false}
                        />

                        <Input
                        color='primary'
                            label="Material"
                            value={prediccion.mp_cod_nombre}
                            readOnly
                            errorMessage={false}
                        />
                        <Input
                        color='primary'
                            label="Cantidad Material"
                            value={prediccion.cantidad_mp}
                            readOnly
                            errorMessage={false}
                        />
                        <Input
                        color='primary'
                            label="Aditivo"
                            value={prediccion.aditivo_nombre}
                            readOnly
                            errorMessage={false}
                        />
                        <Input
                        color='primary'
                            label="Cantidad Aditivo"
                            value={prediccion.cantidad_aditivo}
                            readOnly
                            errorMessage={false}
                        />
                        <Input
                        color='primary'
                            label="Largo (cm)"
                            value={prediccion.largo}
                            readOnly
                            errorMessage={false}
                        />
                        <Input
                        color='primary'
                            label="Ancho (cm)"
                            value={prediccion.ancho}
                            readOnly
                            errorMessage={false}
                        />
                        <Input
                        color='primary'
                            label="Ciclo"
                            value={prediccion.ciclos}
                            readOnly
                            errorMessage={false}
                        />
                        <Input
                        color='primary'
                            label="Predicción Promedio"
                            value={prediccion.prediccion_promedio}
                            readOnly
                            errorMessage={false}
                        />
                        {/* Agrega más inputs aquí si es necesario */}
                    </div>
                    {/* Agrega más campos según lo que necesites mostrar */}
                </CardBody>
            </Card>

            <Card className="mb-4">
                <CardBody>
                    <h3 className="text-md font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                        Recomendacion
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                        <Input color='success' label="Operario" value={recomendacion.operario} readOnly />
                        <Input color='success' label="Responsable" value={recomendacion.responsable} readOnly />
                        <Input color='success' label="Máquina" value={recomendacion.maquina} readOnly />
                        <Input color='success' label="Temp. Molde Macho" value={recomendacion.temp_molde_macho} readOnly />
                        <Input color='success' label="Temp. Molde Hembra" value={recomendacion.temp_molde_hembra} readOnly />
                        <Input color='success' label="Temp. Producto" value={recomendacion.temp_c_producto} readOnly />
                        <Input color='success' label="Zona 1" value={recomendacion.zona_1} readOnly />
                        <Input color='success' label="Zona 2" value={recomendacion.zona_2} readOnly />
                        <Input color='success' label="Zona 3" value={recomendacion.zona_3} readOnly />
                        <Input color='success' label="Zona 4" value={recomendacion.zona_4} readOnly />
                        <Input color='success' label="Zona 5" value={recomendacion.zona_5} readOnly />
                        <Input color='success' label="Valor Prediction" value={recomendacion.valorPrediction} readOnly />
                    </div>
                    {/* Agrega más campos según lo que necesites mostrar */}
                </CardBody>
            </Card>


            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                {renderLineChart('Calidad (%)', 'calidad', recomendacion.valorPrediction)}
                {renderLineChart('Temperatura Molde Macho (°C)', 'molde_macho', recomendacion.temp_molde_macho)}
                {renderLineChart('Temperatura Molde Hembra (°C)', 'molde_hembra', recomendacion.temp_molde_hembra)}
                {renderLineChart('Temperatura Producto (°C)', 'temp_producto', recomendacion.temp_c_producto)}
                {renderLineChart('Temperatura Zona 1 (°C)', 'zona_1', recomendacion.zona_1)}
                {renderLineChart('Temperatura Zona 2 (°C)', 'zona_2', recomendacion.zona_2)}
                {renderLineChart('Temperatura Zona 3 (°C)', 'zona_3', recomendacion.zona_3)}
                {renderLineChart('Temperatura Zona 4 (°C)', 'zona_4', recomendacion.zona_4)}
                {renderLineChart('Temperatura Zona 5 (°C)', 'zona_5', recomendacion.zona_5)}
            </div>

        </div>
    );
}
