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

    // const handleEditResume = async (newResume) => {
    //     try {
    //         await axiosInstance.post("/api/Resumes/new", newResume);
    //         navigate("/profile");
    //         showAlert('success', 'Resume updated successfully!');
    //     } catch (error) {
    //         console.error("Resume update failed:", error.response?.data);
    //         showAlert('error', 'Failed to update resume. Please try again.');
    //     }
    // };

    return (
        <div className="profile-page">
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

            <h2>User Profile</h2>
            {isEditing ? (
                <form className="profile-form" onSubmit={handleSubmit}>
                    <label>
                        Username:
                        <input type="text" name="userName" value={formData.userName} onChange={handleChange} />
                    </label>
                    <label>
                        First Name:
                        <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
                    </label>
                    <label>
                        Last Name:
                        <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
                    </label>
                    <label>
                        Email:
                        <input type="email" name="email" value={formData.email} onChange={handleChange} />
                    </label>
                    <label>
                        Phone Number:
                        <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
                    </label>
                    <button type="submit">Save</button>
                    <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
                </form>
            ) : (
                <div className="profile-details">
                    <p><strong>Username:</strong> {user.userName}</p>
                    <p><strong>First Name:</strong> {user.firstName}</p>
                    <p><strong>Last Name:</strong> {user.lastName}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Phone Number:</strong> {user.phone}</p>
                    <button className="edit-profile-button" onClick={() => setIsEditing(true)}>Edit Profile</button>
                    <button className="edit-profile-button" onClick={() => setIsFormVisible(true)}>Change Password</button>
                    <button className="logout-button" onClick={handleLogout}>Logout</button>
                    <button className="edit-profile-button" onClick={() => setIsResumeFormVisible(true)}>Add Cv</button>
                    <Link to={`/resumes`}><button className="edit-profile-button">View Resumes</button></Link>
                </div>
            )}

            {alert.show && (
                <Alert type={alert.type} message={alert.message} onClose={closeAlert} />
            )}
        </div>
    );
};

export default Profile;