import { useState, useEffect } from 'react';
import { Button, Tooltip } from "@nextui-org/react";
import { WifiOutlined, DisconnectOutlined } from '@ant-design/icons';

const StatusConnect = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    //Conexion a internet
    useEffect(() => {
        const updateOnlineStatus = () => {
            setIsOnline(navigator.onLine);
        };

        window.addEventListener('online', updateOnlineStatus);
        window.addEventListener('offline', updateOnlineStatus);

        return () => {
            window.removeEventListener('online', updateOnlineStatus);
            window.removeEventListener('offline', updateOnlineStatus);
        };
    }, []);


    return (
        <div style={{ paddingRight: "0.1rem" }}>

            <Tooltip color="primary" content={isOnline ? "Conectado" : "Desconectado"} className="capitalize">
                <Button isIconOnly type='text' variant="light" isOnline={isOnline}>
                    {isOnline ? <WifiOutlined style={{ fontSize: '20px' }} /> : <DisconnectOutlined style={{ color: "red", fontSize: '18px' }} />}
                </Button>
            </Tooltip>
        </div>
    )
}

export default StatusConnect
