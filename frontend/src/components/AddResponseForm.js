import React, { useState } from 'react';
import { ActionTypes } from '../utils/ActionTypes';

const AddResponseForm = ({ onSubmit, onClose }) => {
    const [action, setAction] = useState(1); 
    const [deadline, setDeadline] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ action, deadline }); 
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
        </div>
    );
};

export default AddResponseForm;