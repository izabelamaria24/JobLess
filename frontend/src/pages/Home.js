import React, { useContext, useState } from 'react';
import { JobApplicationsContext } from '../context/JobApplicationsContext';
import '../design/Home.css';

const Home = () => {
    const { applications } = useContext(JobApplicationsContext);
    const [filter, setFilter] = useState('all');

    const handleFilterChange = (event) => {
        setFilter(event.target.value);
    };

    const filteredApplications = applications
        .filter(app => {
            if (filter === 'all') return app.onlineAssessmentDeadline || app.interviewDate;
            if (filter === 'oa') return app.onlineAssessmentDeadline;
            if (filter === 'interview') return app.interviewDate;
            return false;
        })
        .map(app => ({
            ...app,
            eventDate: app.onlineAssessmentDeadline || app.interviewDate,
            eventType: app.onlineAssessmentDeadline ? 'Online Assessment' : 'Interview'
        }))
        .sort((a, b) => new Date(b.eventDate) - new Date(a.eventDate));

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
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredApplications.map((app, index) => (
                        <tr key={index}>
                            <td>{app.company}</td>
                            <td>{app.title}</td>
                            <td>{app.eventType}</td>
                            <td>{app.eventDate}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Home;