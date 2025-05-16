import React, { useState } from 'react';
import { ActionTypes } from '../utils/ActionTypes';
import Alert from './Alert'; 
import { useAlert } from '../utils/useAlert'; 

const AddResponseForm = ({ onSubmit, onClose }) => {
    const [action, setAction] = useState(1); 
    const [deadline, setDeadline] = useState("");
    const { alert, showAlert, closeAlert } = useAlert(); 

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!deadline) {
            showAlert('error', 'Deadline is required!');
            return;
        }

        onSubmit({ action, deadline });
        showAlert('success', 'Response added successfully!');
    };

    return (
        <div className="add-response-form">
            <h3>Add Response</h3>
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
                    <button type="submit">Submit</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </div>
            </form>

            {alert.show && (
                <Alert type={alert.type} message={alert.message} onClose={closeAlert} />
            )}
        </div>
    );
};

export default AddResponseForm;