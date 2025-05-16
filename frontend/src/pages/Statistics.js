import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Alert from '../components/Alert'; 
import { useAlert } from '../utils/useAlert'; 

const Statistics = () => {
    const [stats, setStats] = useState(null);
    const { alert, showAlert, closeAlert } = useAlert(); 

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/Statistics/index`);
                setStats(response.data);
                showAlert('success', 'Statistics fetched successfully.');
            } catch (error) {
                console.error('Error fetching statistics:', error);
                showAlert('error', 'Failed to fetch statistics.');
            }
        };

        fetchStats();
    }, [showAlert]);

    if (!stats) return <p>Loading...</p>;

    return (
        <div>
            <h2>Statistics</h2>
            <p>Total Applications: {stats.totalApplications}</p>
            <p>Open Applications: {stats.openApplications}</p>

            {alert.show && (
                <Alert type={alert.type} message={alert.message} onClose={closeAlert} />
            )}
        </div>
    );
};

export default Statistics;