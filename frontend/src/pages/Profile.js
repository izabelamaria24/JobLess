import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import ChangePasswordForm from '../components/ChangePasswordForm';
import '../design/Profile.css';
import axiosInstance from '../utils/axiosInstance';
import Modal from '../components/Modal';
import ResumeForm from '../components/ResumeForm';
import Alert from '../components/Alert'; 
import { useAlert } from '../utils/useAlert'; 
import { Link, useNavigate } from 'react-router-dom';

const Profile = () => {
    const { user, updateUser, logout } = useContext(AuthContext);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(null);

    const [isFormVisible, setIsFormVisible] = useState(false);
    const [isResumeFormVisible, setIsResumeFormVisible] = useState(false);

    const navigate = useNavigate();
    const { alert, showAlert, closeAlert } = useAlert(); 

    useEffect(() => {
        if (user) {
            setFormData({
                userName: user.userName || '',
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                phone: user.phone || '',
            });
        }
    }, [user]);

    if (!user) {
        return <p>Loading...</p>;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateUser(formData);
            setIsEditing(false);
            showAlert('success', 'Profile updated successfully!');
        } catch (error) {
            showAlert('error', 'Failed to update profile. Please try again.');
        }
    };

    const handleLogout = () => {
        logout();
        showAlert('success', 'Logged out successfully.');
    };

    const handlePasswordChange = async (changePassword) => {
        try {
            await axiosInstance.post("/api/Users/change-password", changePassword);
            setIsFormVisible(false);
            showAlert('success', 'Password changed successfully!');
            navigate("/profile");
        } catch (error) {
            console.error("Password change failed:", error.response?.data);
            showAlert('error', 'Failed to change password. Please try again.');
        }
    };

    const handleNewResume = async (newResume) => {
        setIsResumeFormVisible(false);
        try {
            await axiosInstance.post("/api/Resumes/new", newResume);
            showAlert('success', 'Resume added successfully!');
            navigate("/profile");
        } catch (error) {
            console.error("Resume creation failed:", error.response?.data);
            showAlert('error', 'Failed to add resume. Please try again.');
        }
    };

    return (
        <div className="profile-container">
            <Modal isVisible={isFormVisible} onClose={() => setIsFormVisible(false)}>
                <ChangePasswordForm onSubmit={handlePasswordChange} />
            </Modal>

            <Modal isVisible={isResumeFormVisible} onClose={() => setIsResumeFormVisible(false)}>
                <ResumeForm
                    onSubmit={handleNewResume}
                    initialData={{}}
                    userId={user.userId}
                />
            </Modal>

            <div className="profile-header">
                <h1>User Profile</h1>
                <p>Manage your personal information</p>
            </div>

            <div className="profile-card">
                {isEditing ? (
                    <form className="profile-section" onSubmit={handleSubmit}>
                        <h2 className="profile-section-title">Edit Profile</h2>
                        
                        <div className="profile-form-group">
                            <label>Username:</label>
                            <input 
                                type="text" 
                                name="userName" 
                                className="profile-input"
                                value={formData.userName} 
                                onChange={handleChange} 
                            />
                        </div>
                        
                        <div className="profile-form-group">
                            <label>First Name:</label>
                            <input 
                                type="text" 
                                name="firstName" 
                                className="profile-input"
                                value={formData.firstName} 
                                onChange={handleChange} 
                            />
                        </div>
                        
                        <div className="profile-form-group">
                            <label>Last Name:</label>
                            <input 
                                type="text" 
                                name="lastName" 
                                className="profile-input"
                                value={formData.lastName} 
                                onChange={handleChange} 
                            />
                        </div>
                        
                        <div className="profile-form-group">
                            <label>Email:</label>
                            <input 
                                type="email" 
                                name="email" 
                                className="profile-input"
                                value={formData.email} 
                                onChange={handleChange} 
                            />
                        </div>
                        
                        <div className="profile-form-group">
                            <label>Phone Number:</label>
                            <input 
                                type="text" 
                                name="phone" 
                                className="profile-input"
                                value={formData.phone} 
                                onChange={handleChange} 
                            />
                        </div>
                        
                        <div className="profile-buttons">
                            <button className="profile-button secondary" type="button" onClick={() => setIsEditing(false)}>Cancel</button>
                            <button className="profile-button" type="submit">Save</button>
                        </div>
                    </form>
                ) : (
                    <div className="profile-section">
                        <h2 className="profile-section-title">Personal Information</h2>
                        
                        <div className="profile-info-row">
                            <span className="profile-info-label">Username:</span>
                            <span className="profile-info-value">{user.userName}</span>
                        </div>
                        
                        <div className="profile-info-row">
                            <span className="profile-info-label">First Name:</span>
                            <span className="profile-info-value">{user.firstName}</span>
                        </div>
                        
                        <div className="profile-info-row">
                            <span className="profile-info-label">Last Name:</span>
                            <span className="profile-info-value">{user.lastName}</span>
                        </div>
                        
                        <div className="profile-info-row">
                            <span className="profile-info-label">Email:</span>
                            <span className="profile-info-value">{user.email}</span>
                        </div>
                        
                        <div className="profile-info-row">
                            <span className="profile-info-label">Phone Number:</span>
                            <span className="profile-info-value">{user.phone}</span>
                        </div>
                        
                        <div className="profile-buttons">
                            <button className="profile-button" onClick={() => setIsEditing(true)}>Edit Profile</button>
                            <button className="profile-button" onClick={() => setIsFormVisible(true)}>Change Password</button>
                            <button className="profile-button" onClick={() => setIsResumeFormVisible(true)}>Add CV</button>
                            <Link to={`/resumes`}><button className="profile-button">View Resumes</button></Link>
                            <Link to={`/cover-letters`}><button className="profile-button">View Cover Letters</button></Link>
                            <button className="logout-button" onClick={handleLogout}>Logout</button>
                        </div>
                    </div>
                )}
            </div>

            {alert.show && (
                <Alert type={alert.type} message={alert.message} onClose={closeAlert} />
            )}
        </div>
    );
};

export default Profile;