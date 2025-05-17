import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../design/Application.css';
import Modal from '../components/Modal';
import AddResponseForm from '../components/AddResponseForm';
import Alert from '../components/Alert';
import { useAlert } from '../utils/useAlert'; 
import { JobApplicationsContext } from '../context/JobApplicationsContext';

const Application = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { fetchApplication, deleteApplication, addResponse, getInterviewQuestions } = useContext(JobApplicationsContext);

    const [application, setApplication] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { alert, showAlert, closeAlert } = useAlert();

    useEffect(() => {
        const loadApplication = async () => {
            try {
                const data = await fetchApplication(id);
                setApplication(data);
                showAlert('success', 'Application details loaded successfully.');
            } catch (err) {
                showAlert('error', err.message || 'Failed to load application details.');
            }
        };

        loadApplication();
    }, [id, fetchApplication, showAlert]);

    const handleDelete = async () => {
        try {
            await deleteApplication(id);
            showAlert('success', 'Application deleted successfully.');
            navigate("/applications");
        } catch (err) {
            showAlert('error', err.message || 'Failed to delete application.');
        }
    };

    const handleAddResponse = async (formData) => {
        try {
            await addResponse({ ...formData, applicationId: id });
            setIsModalOpen(false);
            showAlert('success', 'Response added successfully.');
        } catch (err) {
            showAlert('error', err.message || 'Failed to add response.');
        }
    };


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

            <Modal isVisible={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <AddResponseForm onSubmit={handleAddResponse} onClose={() => setIsModalOpen(false)} />
            </Modal>

            {alert.show && (
                <Alert type={alert.type} message={alert.message} onClose={closeAlert} />
            )}
        </div>
    );
};

export default Application;