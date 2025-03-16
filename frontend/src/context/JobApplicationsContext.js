
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const JobApplicationsContext = createContext();

const JobApplicationsProvider = ({ children }) => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get('/api/applications');
        setApplications(response.data);
      } catch (error) {
        console.error('Error fetching job applications:', error);
      }
    };

    fetchApplications();
  }, []);

  const addApplication = async (application) => {
    try {
      const response = await axios.post('/api/applications', application);
      setApplications([...applications, response.data]);
    } catch (error) {
      console.error('Error adding job application:', error);
    }
  };

  const updateApplication = async (index, updatedApplication) => {
    try {
      const response = await axios.put(`/api/applications/${updatedApplication.id}`, updatedApplication);
      const updatedApplications = applications.map((app, i) =>
        i === index ? response.data : app
      );
      setApplications(updatedApplications);
    } catch (error) {
      console.error('Error updating job application:', error);
    }
  };

  return (
    <JobApplicationsContext.Provider value={{ applications, addApplication, updateApplication }}>
      {children}
    </JobApplicationsContext.Provider>
  );
};

export { JobApplicationsContext, JobApplicationsProvider };