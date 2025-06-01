import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import PdfUpload from '../components/PdfUpload';
import Alert from '../components/Alert';
import { useAlert } from '../utils/useAlert';
import { useNavigate } from 'react-router-dom';
import PdfUploadCoverLetter from '../components/PdfUploadCoverLetter';

const CoverLetters = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const { alert, showAlert, closeAlert } = useAlert();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const res = await axiosInstance.get('/api/Applications/index');
                console.log('Fetched applications:', res.data);
                setApplications(res.data);
                showAlert('success', 'Applications fetched successfully.');
            } catch (err) {
                showAlert('error', 'An error occurred while fetching applications.');
            } finally {
                setLoading(false);
            }
        };
        fetchApplications();
    }, [showAlert]);

    const handleDeleteCoverLetter = async (application) => {
        try {
            const updatedApp = { ...application, path: null };
            await axiosInstance.put(`/api/Applications/edit/${application.id}`, updatedApp);
            setApplications(applications.map(app => app.id === application.id ? { ...app, Path: null } : app));
            showAlert('success', 'Cover letter deleted successfully.');
        } catch (err) {
            showAlert('error', 'Failed to delete cover letter.');
        }
    };

    if (loading) return <div className="p-4">Loading cover letters...</div>;

    const coverLetterApps = applications.filter(app => app.path);

    return (
        <div className="resumes-container">
            <h1>Your Cover Letters</h1>
            <div className="resumes-grid">
                {coverLetterApps.length === 0 ? (
                    <div className="message">You don't have any cover letters yet.</div>
                ) : (
                    coverLetterApps.map((app) => (
                        <div key={app.id} className="resume-card">
                            <h2>Cover Letter for {app.company} - {app.jobTitle}</h2>
                            <p><strong>Email:</strong> {app.user?.email}</p>
                            <div className="resume-card-actions">
                                <button
                                    className="view-button"
                                    onClick={() => navigate('/viewer', { state: { pdfUrl: app.path } })}
                                >
                                    View Cover Letter
                                </button>
                                <button
                                    className="delete-button"
                                    onClick={() => handleDeleteCoverLetter(app)}
                                >
                                    Delete Cover Letter
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <h2>Upload Cover Letter for an Application</h2>
            <div className="resumes-grid">
                {applications.map(app => (
                    <div key={app.id} className="resume-card">
                        <h3>{app.company} - {app.jobTitle}</h3>
                        <PdfUploadCoverLetter applicationId={app.id}  />
                    </div>
                ))}
            </div>
            {alert.show && (
                <Alert type={alert.type} message={alert.message} onClose={closeAlert} />
            )}
        </div>
    );
};

export default CoverLetters;