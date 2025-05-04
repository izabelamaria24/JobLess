import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const InterviewQuestions = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { answer, links } = location.state || {}; 

    if (!answer) {
        return (
        <div>
            <p>No interview questions available.</p>
            <button onClick={() => navigate(-1)}>Go Back</button>
        </div>
        );
    }

    return (
        <div className="interview-questions">
        <h2>Interview Questions</h2>
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
        </div>
    );
};

export default InterviewQuestions;