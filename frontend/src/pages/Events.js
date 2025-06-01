import React, { useContext, useState, useEffect } from 'react';
import { ApplicationContext } from '../context/ApplicationContext';
import '../design/Home.css';
import axios from 'axios';
import Alert from '../components/Alert'; 
import { useAlert } from '../utils/useAlert'; 

const Events = () => {
    const { applications } = useContext(ApplicationContext);
    const [filter, setFilter] = useState('all');
    const [responses, setResponses] = useState([]);
    const { alert, showAlert, closeAlert } = useAlert(); 

    useEffect(() => {
        fetchResponses();
    }, []);

    const fetchResponses = async () => {
        try {
            let token = localStorage.getItem("token");
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/Responses/index`, {
                headers: {
                    Authorization: `Bearer ${JSON.parse(token)}`,
                },
            });
            setResponses(response.data);
            showAlert('success', 'Responses fetched successfully.');
        } catch (error) {
            console.error('Error fetching job applications:', error);
            showAlert('error', 'Failed to fetch responses.');
        }
    };

    const handleFilterChange = (event) => {
        setFilter(event.target.value);
    };

    const filteredApplications = applications
        .map((app) => {
            const appResponses = responses
                .filter((response) => response.applicationId === app.id)
                .map((response) => ({
                    ...response,
                    firstAction: response.actions?.[0] || null,
                }))
                .filter((response) => response.firstAction);

            const matchingResponse = appResponses.find((response) => {
                const action = response.firstAction?.action;

                if (filter === 'all') return action >= 2 && action <= 12;
                if (filter === 'oa') return action >= 2 && action <= 4;
                if (filter === 'interview') return action >= 5 && action <= 12;

                return false;
            });

            if (!matchingResponse) return null;

            const { deadline, action } = matchingResponse.firstAction;

            const formattedDeadline = new Date(deadline).toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            });

            return {
                ...app,
                eventDate: formattedDeadline,
                eventType:
                    action >= 2 && action <= 4
                        ? 'Online Assessment'
                        : action >= 5 && action <= 12
                        ? 'Interview'
                        : 'Other',
            };
        })
        .filter(Boolean) 
        .sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));

    return (
        <div className="home-page">
            <h2>Upcoming Events</h2>
            <div className="filter-container">
                <label htmlFor="filter">Filter by:</label>
                <select id="filter" value={filter} onChange={handleFilterChange}>
                    <option value="all">All</option>
                    <option value="oa">Online Assessments</option>
                    <option value="interview">Interviews</option>
                </select>
            </div>
            <table className="events-table">
                <thead>
                    <tr>
                        <th>Company</th>
                        <th>Title</th>
                        <th>Event Type</th>
                        <th>Deadline</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredApplications.map((app, index) => (
                        <tr key={index}>
                            <td>{app.company}</td>
                            <td>{app.jobTitle}</td>
                            <td>{app.eventType}</td>
                            <td>{app.eventDate}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {alert.show && (
                <Alert type={alert.type} message={alert.message} onClose={closeAlert} />
            )}
        </div>
    );
};

export default Events;