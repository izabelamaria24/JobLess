import React, { useState, useEffect } from 'react';
import { ActionTypes } from '../utils/ActionTypes';
import Alert from './Alert'; 
import { useAlert } from '../utils/useAlert'; 
import '../design/AddResponseForm.css';

const ResponseForm = ({ onSubmit, onClose, initialData = null }) => {
    const [action, setAction] = useState(1); 
    const [deadline, setDeadline] = useState("");
    const { alert, showAlert, closeAlert } = useAlert(); 
    const isEditMode = !!initialData;

    useEffect(() => {
        if (initialData) {
            setAction(initialData.action || 1);
            
            // Format deadline if it exists
            if (initialData.deadline) {
                const deadlineDate = new Date(initialData.deadline);
                if (!isNaN(deadlineDate.getTime())) {
                    setDeadline(deadlineDate.toISOString().split('T')[0]);
                }
            }
        }
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!deadline) {
            showAlert('error', 'Deadline is required!');
            return;
        }

        onSubmit({ action, deadline });
    };

    return (
        <div className="response-form">
            <h3>{isEditMode ? 'Edit Response' : 'Add Response'}</h3>
            <form onSubmit={handleSubmit}>
                <label>
                    Action:
                    <select value={action} onChange={(e) => setAction(parseInt(e.target.value, 10))}>
                        {Object.entries(ActionTypes).map(([key, value]) => (
                            <option key={key} value={key}>{value}</option>
                        ))}
                    </select>
                </label>
                <label>
                    Deadline:
                    <input
                        type="date"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        required
                    />
                </label>
                <div className="form-buttons">
                    <button type="submit">{isEditMode ? 'Update' : 'Submit'}</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </div>
            </form>

            {alert.show && (
                <Alert type={alert.type} message={alert.message} onClose={closeAlert} />
            )}
        </div>
    );
};

export default ResponseForm;