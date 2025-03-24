import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import '../design/Profile.css';

const Profile = () => {
    const { user } = useContext(AuthContext);

    if (!user) {
        return <p>Loading...</p>;
    }

    return (
        <div className="profile-page">
            <h2>User Profile</h2>
            <div className="profile-details">
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>First Name:</strong> {user.firstname}</p>
                <p><strong>Last Name:</strong> {user.lastname}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Phone Number:</strong> {user.phone_number}</p>
            </div>
            <button className="edit-profile-button">Edit Profile</button>
        </div>
    );
};

export default Profile;