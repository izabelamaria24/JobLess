import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';

const JobApplicationsContext = createContext();

const JobApplicationsProvider = ({ children }) => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axiosInstance.get("/api/Applications/index");
        setApplications(response.data);
      } catch (error) {
          console.error("Error fetching job applications:", error.response?.data || error.message);
      }
    };

    fetchApplications();
  }, []); 

  const addApplication = async (application) => {
    try {
      const response = await axiosInstance.post("/api/Applications/new", application);
      setApplications([...applications, response.data]);
    } catch (error) {
        console.error("Error adding job application:", error.response?.data || error.message);
    }
  };

  const updateApplication = async (index, updatedApplication) => {
    try {
      const applicationId = applications[index]?.id;
      if (!applicationId) {
          console.error("Application ID not found.");
          return;
      }

      const response = await axiosInstance.put(`/api/Applications/edit/${applicationId}`, updatedApplication);
      const updatedApplications = applications.map((app, i) =>
          i === index ? response.data : app
      );
      setApplications(updatedApplications);
    } catch (error) {
        console.error("Error updating job application:", error.response?.data || error.message);
    }
  };

  return (
    <JobApplicationsContext.Provider value={{ applications, addApplication, updateApplication }}>
      {children}
    </JobApplicationsContext.Provider>
  );
};

export { JobApplicationsContext, JobApplicationsProvider };