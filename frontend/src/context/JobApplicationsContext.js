import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const JobApplicationsContext = createContext();

const JobApplicationsProvider = ({ children }) => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {

        let token = localStorage.getItem("token");
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/Applications/index`, {
          headers: {
            Authorization: `Bearer ${JSON.parse(token)}`,
          },
        });

        setApplications(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching job applications:', error);
      }
    };

    fetchApplications();
  }, []); 

  const addApplication = async (application) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/api/Applications/new`,
          application,
          {
            headers: {
              Authorization: `Bearer ${JSON.parse(token)}`
            }
          }
        );

        setApplications([...applications, response.data]);
    } catch (error) {
        console.error('Error adding job application:', error);
    }
  };

  const updateApplication = async (index, updatedApplication) => {
    try {
        const applicationId = applications[index]?.id;

        updatedApplication.id = applicationId;

        const token = localStorage.getItem("token");
        const response = await axios.put(
          `${process.env.REACT_APP_API_BASE_URL}/api/Applications/edit/${updatedApplication.id}`,
          updatedApplication,
          {
            headers: {
              Authorization: `Bearer ${JSON.parse(token)}`
            }
          }
        );

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