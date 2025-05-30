import React, { useState } from 'react';
import Alert from './Alert';
import { useAlert } from '../utils/useAlert'; 

const ChangePasswordForm = ({ onSubmit }) => {
    const [CurrentPassword, setCurrentPassword] = useState('');
    const [NewPassword, setNewPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { alert, showAlert, closeAlert } = useAlert(); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (!CurrentPassword || !NewPassword) {
            showAlert('error', 'Please fill in both password fields.');
            setIsLoading(false);
            return;
        }

        try {
            await onSubmit({
                CurrentPassword,
                NewPassword,
            });
            setIsLoading(false);

        } catch (err) {
            setIsLoading(false);
            showAlert('error', 'Failed to change password. Please try again.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="profile-card change-password-form">
            <h2 className="profile-section-title">Change Password</h2>
            <div className="profile-form-group">
                <label>Old password:</label>
                <input
                    type="password"
                    value={CurrentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    className="profile-input"
                />
            </div>
            <div className="profile-form-group">
                <label>New password:</label>
                <input
                    type="password"
                    value={NewPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="profile-input"
                />
            </div>

            <button type="submit" disabled={isLoading} className="profile-button">
                {isLoading ? 'Submitting...' : 'Submit'}
            </button>

            {alert.show && (
                <Alert type={alert.type} message={alert.message} onClose={closeAlert} />
            )}
        </form>
    );
};

export default ChangePasswordForm;