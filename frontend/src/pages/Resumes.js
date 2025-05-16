import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import '../design/Resumes.css';
import PdfUpload from '../components/PdfUpload';
import Alert from '../components/Alert'; 
import { useAlert } from '../utils/useAlert'; 
import { useNavigate } from 'react-router-dom';

const Resumes = () => {
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);
    const { alert, showAlert, closeAlert } = useAlert(); 
    const navigate = useNavigate();

    useEffect(() => {
        const fetchResumes = async () => {
            try {
                const res = await axiosInstance.get('/api/Resumes/index');
                setResumes(res.data);
                showAlert('success', 'Resumes fetched successfully.');
            } catch (err) {
                if (err.response && err.response.status === 401) {
                    showAlert('error', 'You must be logged in to view your resumes.');
                } else if (err.response && err.response.status === 404) {
                    showAlert('error', 'No resumes found.');
                } else {
                    showAlert('error', 'An error occurred while fetching resumes.');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchResumes();
    }, [showAlert]);

    const handleDelete = async (resumeId) => {
        try {
            await axiosInstance.delete(`/api/Resumes/delete/${resumeId}`);
            setResumes(resumes.filter((r) => r.id !== resumeId));
            showAlert('success', 'Resume deleted successfully.');
        } catch (err) {
            showAlert('error', err.response?.data?.message || 'Failed to delete resume.');
        }
    };

    const handleResumeTips = async (resumePath) => {
        try {
            // const token = localStorage.getItem("token");
            // const res = await axios.get(
            //     `http://localhost:5555/suggestionsCV`,
            //     {
            //         headers: {
            //             Authorization: `Bearer ${token}`
            //         },
            //         params: { path: resumePath }
            //     }
            // );
            // navigate('/resume-tips', { state: { resumeTips: res.data } });

            navigate('/resume-tips');
            showAlert('success', 'Redirecting to resume tips.');
        } catch (error) {
            console.error('Error fetching resume tips:', error);
            showAlert('error', 'Failed to fetch resume tips.');
        }
    };

    if (loading) return <div className="p-4">Loading resumes...</div>;

    return (
        <div className="resumes-container">
            <h1>Your Resumes</h1>
            <div className="resumes-grid">
                {resumes.map((resume) => (
                    <div key={resume.id} className="resume-card">
                        <h2>Resume #{resume.id}</h2>
                        <p><strong>Email:</strong> {resume.user?.email}</p>
                        <p><strong>Phone:</strong> {resume.user?.phone || 'N/A'}</p>
                        <p><strong>LinkedIn:</strong> {resume.linkedIn || 'N/A'}</p>
                        <p><strong>GitHub:</strong> {resume.gitHub || 'N/A'}</p>
                        {resume.path ? (
                            <button
                                className="view-button"
                                onClick={() => navigate('/viewer', { state: { pdfUrl: resume.path } })}
                            >
                                View Resume
                            </button>
                        ) : (
                            <PdfUpload resumeId={resume.id} />
                        )}
                        <button className="delete-button" onClick={() => handleDelete(resume.id)}>Delete Resume</button>
                        <button
                            className="view-button"
                            onClick={() => handleResumeTips(resume.path)}
                        >
                            Get Tips
                        </button>
                    </div>
                ))}
            </div>

            {alert.show && (
                <Alert type={alert.type} message={alert.message} onClose={closeAlert} />
            )}
        </div>
    );
};

export default Resumes;