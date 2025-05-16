import React, { useEffect } from 'react';
import '../design/Alert.css'; 

const Alert = ({ type, message, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
        onClose();
    }, 3000); 

        return () => clearTimeout(timer); 
    }, [onClose]);

    const getAlertClass = () => {
        switch (type) {
        case 'success':
            return 'alert-success';
        case 'warning':
            return 'alert-warning';
        case 'error':
            return 'alert-error';
        default:
            return '';
        }
    };

    return (
        <div className={`alert ${getAlertClass()}`}>
            {message}
        </div>
    );
};

export default Alert;