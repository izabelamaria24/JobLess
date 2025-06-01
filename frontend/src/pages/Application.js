import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../design/Application.css';
import Modal from '../components/Modal';
import ResponseForm from '../components/AddResponseForm';
import Alert from '../components/Alert';
import { useAlert } from '../utils/useAlert'; 
import { ApplicationContext } from '../context/ApplicationContext';
import { JobTypeMap, StatusMap, AvailabilityMap } from '../utils/EnumMappings';

const Application = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { fetchApplication, deleteApplication, addResponse, getInterviewQuestions, fetchApplicationResponses, deleteResponse, editResponse } = useContext(ApplicationContext);

    const [application, setApplication] = useState(null);
    const [responses, setResponses] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedResponse, setSelectedResponse] = useState(null);
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
    
    useEffect(() => {
        const loadResponses = async () => {
            try {
                const responseData = await fetchApplicationResponses(id);
                setResponses(responseData);
            } catch (err) {
                console.error("Error loading responses:", err);
            }
        };
        
        if (id) {
            loadResponses();
        }
    }, [id, fetchApplicationResponses]);

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
            setSelectedResponse(null);
            showAlert('success', 'Response added successfully.');
            
            // Refresh responses after adding a new one
            const responseData = await fetchApplicationResponses(id);
            setResponses(responseData);
        } catch (err) {
            showAlert('error', err.message || 'Failed to add response.');
        }
    };
    
    const handleEditResponse = async (formData) => {
        try {
            if (!selectedResponse || !selectedResponse.id) {
                throw new Error('No response selected for editing');
            }
            
            await editResponse(selectedResponse.id, formData);
            setIsModalOpen(false);
            setSelectedResponse(null);
            showAlert('success', 'Response updated successfully.');
            
            // Refresh responses after editing
            const responseData = await fetchApplicationResponses(id);
            setResponses(responseData);
        } catch (err) {
            showAlert('error', err.message || 'Failed to update response.');
        }
    };
    
    const handleDeleteResponse = async (responseId) => {
        try {
            if (window.confirm("Are you sure you want to delete this response?")) {
                await deleteResponse(responseId);
                // Refresh the responses list after deletion
                const updatedResponses = await fetchApplicationResponses(id);
                setResponses(updatedResponses);
            }
        } catch (err) {
            showAlert('error', err.message || 'Failed to delete response.');
        }
    };
    
    const openAddResponseModal = () => {
        setSelectedResponse(null);
        setIsModalOpen(true);
    };
    
    const openEditResponseModal = (response) => {
        setSelectedResponse(response);
        setIsModalOpen(true);
    };
    
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedResponse(null);
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
            <p><strong>Job Type:</strong> {JobTypeMap[application.jobType] || "Not Specified"}</p>
            <p><strong>Availability:</strong> {AvailabilityMap[application.availability] || "Not Specified"}</p>
            <p><strong>Status:</strong> {StatusMap[application.status] || "Not Specified"}</p>
            
            {responses.length > 0 && (
                <div className="response-history">
                    <h3>Response History</h3>
                    <ul>
                        {responses.map((response, index) => (
                            <li key={index} className="response-item">
                                <div className="response-content">
                                    <div className="response-header">
                                        <div className="response-action">
                                            <strong>{response.actionType}</strong>
                                        </div>
                                        <div className="response-date">
                                            {new Date(response.date).toLocaleDateString()}
                                        </div>
                                    </div>
                                    {response.deadline && (
                                        <div className="response-deadline">
                                            Deadline: {new Date(response.deadline).toLocaleDateString()}
                                        </div>
                                    )}
                                </div>
                                <div className="response-actions">
                                    <button 
                                        className="edit-response-button" 
                                        onClick={() => openEditResponseModal(response)}
                                        title="Edit this response"
                                        aria-label="Edit response"
                                    >
                                        ✎
                                    </button>
                                    <button 
                                        className="delete-response-button" 
                                        onClick={() => handleDeleteResponse(response.id)}
                                        title="Delete this response"
                                        aria-label="Delete response"
                                    >
                                        ×
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            
            <button className="delete-button" onClick={handleDelete}>Delete Application</button>
            <button className="add-response-button" onClick={openAddResponseModal}>Add Response</button>

            <Modal isVisible={isModalOpen} onClose={closeModal}>
                <ResponseForm 
                    onSubmit={selectedResponse ? handleEditResponse : handleAddResponse} 
                    onClose={closeModal} 
                    initialData={selectedResponse}
                />
            </Modal>

            {alert.show && (
                <Alert type={alert.type} message={alert.message} onClose={closeAlert} />
            )}
        </div>
    );
};

export default Application;