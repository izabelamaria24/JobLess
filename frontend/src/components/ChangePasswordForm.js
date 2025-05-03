import React, { useState } from 'react';
// import '../design/JobApplicationForm.css';

const ChangePasswordForm = ({ onSubmit }) => {
    const [CurrentPassword, setCurrentPassword] = useState('')
    const [NewPassword, setNewPassword] = useState('')

    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true)

        if (CurrentPassword === 0 || NewPassword === 0) {
            setError("Please select valid options for Job Type, Availability, and Status.");
            return;
        }

        try {
            await onSubmit({
                CurrentPassword, NewPassword
            });
            setIsLoading(false)
        } catch (err) {
            setIsLoading(false)
        }
    };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     setIsLoading(true);
    //     setError(null);
    //     setSuccess(null);
    
    //     if (!CurrentPassword || !NewPassword) {
    //         setError("Please fill in both password fields.");
    //         setIsLoading(false);
    //         return;
    //     }
    
    //     try {
    //         await onSubmit({
    //             CurrentPassword,
    //             NewPassword
    //         });
    //         setIsLoading(false);
    //         setSuccess("Password changed successfully.");
    //     } catch (err) {
    //         setIsLoading(false);
    //         setError("Failed to change password. Please try again.");
    //     }
    // };
    

    return (
    <form onSubmit={handleSubmit} className="change-password-form">
        <div>
            <label>Old password:</label>
            <input type="password" value={CurrentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
        </div>
        <div>
            <label>New password:</label>
            <input type="password" value={NewPassword} onChange={(e) => setNewPassword(e.target.value)} required />
        </div>

        {error && <p className="error-message">{error}</p>}
        <button type="submit" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit"}
        </button>
    </form>
    );
};

export default ChangePasswordForm;