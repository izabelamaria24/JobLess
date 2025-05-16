import { useState } from 'react';

export const useAlert = () => {
    const [alert, setAlert] = useState({ show: false, type: '', message: '' });

    const showAlert = (type, message) => {
        setAlert({ show: true, type, message });
    };

    const closeAlert = () => {
        setAlert({ show: false, type: '', message: '' });
    };

    return { alert, showAlert, closeAlert };
};