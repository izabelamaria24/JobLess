import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { ActionTypes } from '../utils/ActionTypes'

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

  const fetchApplicationResponses = async (applicationId) => {
    try {
      const response = await axiosInstance.get(`/api/Responses/index`);
      
      const filteredResponses = response.data
        .filter((action) => action.applicationId === applicationId)
        .map((action) => ({
          ...action,
          actionType: ActionTypes[action.action], 
        }));
  
      return filteredResponses;
    } catch (error) {
      console.error("Error fetching application responses:", error.response?.data || error.message);
      return [];
    }
  };

  return (
    <JobApplicationsContext.Provider value={{ applications, addApplication, updateApplication, fetchApplicationResponses }}>
      {children}
    </JobApplicationsContext.Provider>
  );
};

export { JobApplicationsContext, JobApplicationsProvider };