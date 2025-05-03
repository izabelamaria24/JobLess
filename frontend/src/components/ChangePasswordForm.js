import React, { useState } from 'react';
// import '../design/JobApplicationForm.css';

const ChangePasswordForm = ({ onSubmit }) => {
    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')

    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true)

        if (oldPassword === 0 || newPassword === 0) {
            setError("Please select valid options for Job Type, Availability, and Status.");
            return;
        }

        try {
            await onSubmit({
                oldPassword, newPassword
            });
            setIsLoading(false)
        } catch (err) {
            setIsLoading(false)
            setError("Failed to change password. Please try again.");
        }
    };

    return (
    <form onSubmit={handleSubmit} className="change-password-form">
        <div>
            <label>Old password:</label>
            <input type="text" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required />
        </div>
        <div>
            <label>New password:</label>
            <input type="text" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
        </div>

        {error && <p className="error-message">{error}</p>}
        <button type="submit" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit"}
        </button>
    </form>
    );
};

export default ChangePasswordForm;