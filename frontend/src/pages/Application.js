import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../design/Application.css';
import Modal from '../components/Modal';
import AddResponseForm from '../components/AddResponseForm';
import { JobApplicationsContext } from '../context/JobApplicationsContext';
import axios from 'axios';

const Application = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { fetchApplication, deleteApplication, addResponse } = useContext(JobApplicationsContext);

    const [application, setApplication] = useState(null);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const loadApplication = async () => {
        try {
            const data = await fetchApplication(id); 
            setApplication(data);
        } catch (err) {
            setError(err.message);
        }
    };

        loadApplication();
    }, [id, fetchApplication]);

    const handleDelete = async () => {
        try {
            await deleteApplication(id); 
            navigate("/applications");
        } catch (err) {
            setError(err.message);
        }
    };

    const handleAddResponse = async (formData) => {
        try {
        await addResponse({ ...formData, applicationId: id }); 
        setIsModalOpen(false);
        } catch (err) {
        setError(err.message);
        }
    };

    const handleGetInterviewQuestions = async () => {
        try {
            const payload = {
                company: application.company,
                jobTitle: application.jobTitle,
            };

            const response = await axios.post(
                `${process.env.REACT_APP_API_LLM_URL}/interviewQuestions`,
                {
                    data: payload,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.data.answer) {
                const { answer, links } = response.data; 
                navigate("/interview-questions", { state: { answer, links } }); 
            } else {
                alert("No questions returned.");
            }
        } catch (err) {
            alert("Error fetching interview questions: " + (err.response?.data?.error || err.message));
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
        <button className="add-response-button" onClick={() => setIsModalOpen(true)}>Add Response</button>
        <button className="get-questions-button" onClick={handleGetInterviewQuestions}>Get Interview Questions</button>


        <Modal isVisible={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <AddResponseForm onSubmit={handleAddResponse} onClose={() => setIsModalOpen(false)} />
        </Modal>
        </div>
    );
};

export default Application;