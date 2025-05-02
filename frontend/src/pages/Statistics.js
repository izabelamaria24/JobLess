import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Statistics = () => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/Statistics/index`);
                setStats(response.data);
            } catch (error) {
                console.error('Error fetching statistics:', error);
            }
        };

        fetchStats();
    }, []);

    if (!stats) return <p>Loading...</p>;

    return (
        <div>
            <h2>Statistics</h2>
            <p>Total Applications: {stats.totalApplications}</p>
            <p>Open Applications: {stats.openApplications}</p>
        </div>
    );
};

export default Statistics;