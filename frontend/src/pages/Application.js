import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../design/Application.css';

const Application = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [application, setApplication] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchApplication = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(
                    `${process.env.REACT_APP_API_BASE_URL}/api/Applications/show/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${JSON.parse(token)}`,
                        },
                    }
                );
                setApplication(response.data);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to fetch application.");
            }
        };

        fetchApplication();
    }, [id]);

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(
                `${process.env.REACT_APP_API_BASE_URL}/api/Applications/delete/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${JSON.parse(token)}`,
                    },
                }
            );
            navigate("/applications"); 
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete application.");
        }
    };

    if (error) {
        return <p className="error-message">{error}</p>;
    }

    if (!application) {
        return <p>Loading...</p>;
    }

    return (
        <div className="application-details">
            <h2>Application Details</h2>
            <p><strong>Company:</strong> {application.company}</p>
            <p><strong>Job Title:</strong> {application.jobTitle}</p>
            <p><strong>Location:</strong> {application.location}</p>
            <p><strong>Application Date:</strong> {application.date}</p>
            <p><strong>Job Type:</strong> {application.jobType}</p>
            <p><strong>Availability:</strong> {application.availability}</p>
            <p><strong>Status:</strong> {application.status}</p>
            <p><strong>Online Assessment Deadline:</strong> {application.onlineAssessmentDeadline || "N/A"}</p>
            <p><strong>Interview Date:</strong> {application.interviewDate || "N/A"}</p>
            <button className="delete-button" onClick={handleDelete}>Delete Application</button>
        </div>
    );
};

export default Application;