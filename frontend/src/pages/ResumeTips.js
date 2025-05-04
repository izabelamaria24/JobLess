import React from "react";
import { useLocation } from 'react-router-dom';

// import '../design/ResumeTips.css';

const ResumeTips = () => {
    const location = useLocation();
    const resumeTips = location.state?.resumeTips;

    return (
        <div className="resume-tips-container">
            <h1>Resume Tips</h1>
            {resumeTips ? (
                <div>
                    <h2>Here are your personalized resume tips:</h2>
                    <ul>
                        {resumeTips.map((tip, index) => (
                            <li key={index}>{tip}</li>
                        ))}
                    </ul>
                </div>
            ) : (
                <div>No resume tips available.</div>
            )}
        </div>
    );
};

export default ResumeTips;