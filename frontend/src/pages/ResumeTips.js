import React, { useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import Alert from "../components/Alert"; 
import { useAlert } from "../utils/useAlert"; 

// import '../design/ResumeTips.css';

const ResumeTips = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const resumeTips = location.state?.resumeTips;
    const { alert, showAlert, closeAlert } = useAlert(); 

    useEffect(() => {
        if (!resumeTips) {
            showAlert('error', 'No resume tips available.');
        }
    }, [resumeTips, showAlert]);

    if (!resumeTips) {
        return (
            <div className="resume-tips-container">
                <h1>Resume Tips</h1>
                <div>No resume tips available.</div>
                <button onClick={() => navigate(-1)}>Go Back</button>
                {alert.show && (
                    <Alert type={alert.type} message={alert.message} onClose={closeAlert} />
                )}
            </div>
        );
    }

    return (
        <div className="resume-tips-container">
            <h1>Resume Tips</h1>
            <div>
                <h2>Here are your personalized resume tips:</h2>
                <ul>
                    {resumeTips.map((tip, index) => (
                        <li key={index}>{tip}</li>
                    ))}
                </ul>
            </div>

            {alert.show && (
                <Alert type={alert.type} message={alert.message} onClose={closeAlert} />
            )}
        </div>
    );
};

export default ResumeTips;