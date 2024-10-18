import React, { useEffect } from 'react';
import { notification } from 'antd';

const ConnectionStatus = () => {
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);

  const notifyConnectionChange = (status) => {
    notification[status ? 'success' : 'error']({
      message: `Estado de Conexión`,
      description: status
        ? 'Estás conectado a Internet.'
        : 'No hay conexión a Internet.',
      duration: 2, // Duración en segundos
    });
  };

  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
      notifyConnectionChange(navigator.onLine);
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    // Limpieza de los event listeners al desmontar el componente
    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  return null; // No renderiza nada visual
};

export default ConnectionStatus;
