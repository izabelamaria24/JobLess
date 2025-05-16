import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Alert from '../components/Alert'; 
import { useAlert } from '../utils/useAlert'; 

const CompareSalary = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { answer, links } = location.state || {};
    const { alert, showAlert, closeAlert } = useAlert();

    useEffect(() => {
        if (!answer) {
            showAlert('error', 'No salary comparison data available.');
        }
    }, [answer, showAlert]);

    if (!answer) {
        return (
            <div>
                <button onClick={() => navigate(-1)}>Go Back</button>
                {alert.show && (
                    <Alert type={alert.type} message={alert.message} onClose={closeAlert} />
                )}
            </div>
        );
    }

    return (
        <div className="compare-salary">
            <h2>Salary Comparison</h2>
            <p>{answer}</p>
            {links && links.length > 0 && (
                <div>
                    <h3>Related Links</h3>
                    <ul>
                        {links.map((link, index) => (
                            <li key={index}>
                                <a href={link} target="_blank" rel="noopener noreferrer">
                                    {link}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            <button onClick={() => navigate(-1)}>Go Back</button>

            {alert.show && (
                <Alert type={alert.type} message={alert.message} onClose={closeAlert} />
            )}
        </div>
    );
};

export default CompareSalary;