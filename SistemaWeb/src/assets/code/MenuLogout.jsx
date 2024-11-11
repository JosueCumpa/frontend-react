import React from 'react'
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, User } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";


const MenuLogout = () => {

    const navigate = useNavigate();
    //const tokens = JSON.parse(localStorage.getItem('tokens'));
    const user_data = JSON.parse(localStorage.getItem("user_data"));

    //boton de logout
    const handleLogout = () => {
        // Limpiar el token del almacenamiento local
        toast.success("Sesion Finalizada")
        localStorage.removeItem("user_data");
        localStorage.removeItem("tokens");
        // Redirigir al usuario a la página de inicio de sesión
        navigate("/dev/login");

    };


    return (

        <div style={{ paddingRight: '1%', paddingTop: "0.6rem" }}>
            <Dropdown>
                <DropdownTrigger>
                    <Button
                        color='primary'
                        variant="light"
                    >
                        <User
                            name={user_data.name}
                            avatarProps={{
                                src: "https://avatars.githubusercontent.com/u/30373425?v=4"
                            }}
                        />
                    </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Static Actions">
                    <DropdownItem key="delete" className="text-danger" color="danger" onClick={handleLogout}>
                        Cerrar Sesion
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>


        </div>
    )
}

export default MenuLogout
