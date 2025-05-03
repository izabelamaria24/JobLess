import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import '../design/Profile.css';

const Profile = () => {
    const { user, updateUser, logout } = useContext(AuthContext);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(null);

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
        await updateUser(formData);
        setIsEditing(false);
    };

    const handleLogout = () => {
        logout();
        // navigate('/login');
    }

    return (
        <div className="profile-page">
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
                    <button className='logout-button' onClick={handleLogout}>Logout</button>
                </div>
            )}
        </div>
    );
};

export default Profile;