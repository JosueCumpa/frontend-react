import { useState, useEffect } from "react";
import { Card, CardBody, Image, Button, Input } from '@nextui-org/react'
import { EyeFilledIcon } from "../assets/code/EyeFilledIcon";
import { EyeSlashFilledIcon } from "../assets/code/EyeSlashFilledIcon";
import { FaUser } from "react-icons/fa";
import Logo from "../assets/image/logito.png";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../api/axiosconf";
export default function Login() {

    const navigate = useNavigate();
    useEffect(() => {
        // Elimina el token del localStorage al cargar la página de login
        localStorage.removeItem("tokens");
        localStorage.removeItem("user_data");
    }, []);

    const [isVisible, setIsVisible] = useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);

    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/token/`, {
                username: user,
                password: password,
            });

            // Acceder a los datos de la respuesta
            const tokens = response.data?.tokens;
            const user_data = response.data?.user_data;

            // Verificar los valores de user_data.group y user_data.op
            if (user_data.group === "false" && user_data.op === "false") {
                toast.error("No tienes permisos para acceder al sistema.");
                return; // Salir de la función para evitar continuar con la navegación
            }

            // Si tiene permisos, almacenar los datos y redirigir
            localStorage.setItem("tokens", JSON.stringify(tokens));
            localStorage.setItem("user_data", JSON.stringify(user_data));

            toast.success("Inicio de sesión exitoso!");
            navigate("/dev/dashboard");
        } catch (error) {
            // Manejo de errores
            toast.error("Error al iniciar sesión. Verifica tus credenciales.");
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            handleLogin();
        }
    };
    return (
        <div className="flex items-center justify-center h-screen">
            <Toaster />
            <Card
                isBlurred
                className="border-none bg-background/60 dark:bg-default-100/50 max-w-[610px]"
                shadow="md"
            >
                <CardBody>
                    <div className="grid grid-cols-6 md:grid-cols-12 gap-6 md:gap-4 items-center justify-center">
                        <div className="relative col-span-6 md:col-span-4">
                            <Image
                                className="m-5 opacity-100"
                                alt="Logo dev"
                                src={Logo}
                                width={300}
                            />
                        </div>

                        <div className="flex flex-col col-span-6 md:col-span-8 items-center">
                            <div className="flex justify-between items-start">
                                <div className="flex flex-col gap-0 ">
                                    <h1 className="text-large font-medium mt-2 text-center">
                                        INICIO DE SESION
                                    </h1>
                                    <br />
                                </div>
                            </div>

                            <div className="flex justify-between items-start gap-4">
                                <Input
                                    type="text"
                                    label="Usuario"
                                    variant="bordered"
                                    className="max-w-xs"
                                    onChange={(e) => setUser(e.target.value)}
                                    value={user}
                                    endContent={
                                        <FaUser className="text-default-600 pointer-events-none h-6 w-6" />
                                    }
                                />
                            </div>

                            <br />

                            <div className="flex justify-between items-start gap-4">
                                <Input
                                    label="Contraseña"
                                    variant="bordered"
                                    endContent={
                                        <button
                                            className="focus:outline-none"
                                            type="button"
                                            onClick={toggleVisibility}
                                        >
                                            {isVisible ? (
                                                <EyeSlashFilledIcon className="text-2xl text-default-600 pointer-events-none" />
                                            ) : (
                                                <EyeFilledIcon className="text-2xl text-default-600 pointer-events-none" />
                                            )}
                                        </button>
                                    }
                                    type={isVisible ? "text" : "password"}
                                    className="max-w-xs"
                                    onChange={(e) => setPassword(e.target.value)}
                                    value={password}
                                    onKeyDown={handleKeyDown}
                                />
                            </div>

                            <br />

                            <Button
                                radius="full"
                                className="bg-gradient-to-tr from-blue-500 to-purple-500 text-white shadow-lg"
                                onClick={handleLogin}
                            >
                                INGRESAR
                            </Button>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </div>
    )
}
