import React, { createContext, useState, useEffect, useContext } from 'react';
import axiosInstance from '../utils/axiosInstance';
import axiosInstance2 from '../utils/axiosInstance2';
import { ActionTypes } from '../utils/ActionTypes';
import { useAlert } from '../utils/useAlert'; 
import { AuthContext } from './AuthContext';

const JobApplicationsContext = createContext();

const JobApplicationsProvider = ({ children }) => {
  const [applications, setApplications] = useState([]);
  const { showAlert } = useAlert(); 
  const { token } = useContext(AuthContext);


  useEffect(() => {
    if (token) {
      fetchApplications();
    }
  }, [token]);

  const fetchApplications = async () => {
    try {
      const response = await axiosInstance.get("/api/Applications/index");
      setApplications(response.data);
      // showAlert('success', 'Job applications fetched successfully.');
    } catch (error) {
      console.error("Error fetching job applications:", error.response?.data || error.message);
      showAlert('error', 'Failed to fetch job applications.');
    }
  };

  const addApplication = async (application) => {
    try {
      const response = await axiosInstance.post("/api/Applications/new", application);
      setApplications([...applications, response.data]);
      // showAlert('success', 'Job application added successfully.');
    } catch (error) {
      console.error("Error adding job application:", error.response?.data || error.message);
      showAlert('error', 'Failed to add job application.');
    }
  };

  const updateApplication = async (index, updatedApplication) => {
    try {
      const applicationId = applications[index]?.id;
      if (!applicationId) {
        console.error("Application ID not found.");
        showAlert('error', 'Application ID not found.');
        return;
      }

      updatedApplication.id = applicationId;
      const response = await axiosInstance.put(`/api/Applications/edit/${applicationId}`, updatedApplication);
      const updatedApplications = applications.map((app, i) =>
        i === index ? response.data : app
      );
      setApplications(updatedApplications);
      // showAlert('success', 'Job application updated successfully.');
    } catch (error) {
      console.error("Error updating job application:", error.response?.data || error.message);
      showAlert('error', 'Failed to update job application.');
    }
  };

  const fetchApplicationResponses = async (applicationId) => {
    try {
      const response = await axiosInstance.get(`/api/Responses/history/${applicationId}`);

      if (response.data.length === 0) {
        return [];
      }

      const mappedResponses = response.data.map(response => ({
        ...response,
        actionType: ActionTypes[response.action]
      }));

      return mappedResponses;
    } catch (error) {
      console.error("Error fetching application responses:", error.response?.data || error.message);
      if (error.response?.status === 404) {
        console.log(`No responses found for application ${applicationId}`);
        return [];
      }
      showAlert('error', 'Failed to fetch application responses.');
      return [];
    }
  };

  const addResponse = async ({ action, deadline, applicationId }) => {
    try {
      const response = await axiosInstance.post("/api/Responses/new", {
        action,
        deadline,
        applicationId,
      });
      // showAlert('success', 'Response added successfully.');
      return response.data;
    } catch (error) {
      console.error("Error adding response:", error.response?.data || error.message);
      showAlert('error', 'Failed to add response.');
      throw new Error(error.response?.data?.message || "Failed to add response.");
    }
  };

  const deleteResponse = async (responseId) => {
    try {
      await axiosInstance.delete(`/api/Responses/delete/${responseId}`);
      showAlert('success', 'Response deleted successfully.');
      return true;
    } catch (error) {
      console.error("Error deleting response:", error.response?.data || error.message);
      showAlert('error', 'Failed to delete response.');
      throw new Error(error.response?.data?.message || "Failed to delete response.");
    }
  };

  const editResponse = async (responseId, updatedResponse) => {
    try {
      const response = await axiosInstance.put(`/api/Responses/edit/${responseId}`, {
        ...updatedResponse,
        id: responseId
      });
      showAlert('success', 'Response updated successfully.');
      return response.data;
    } catch (error) {
      console.error("Error updating response:", error.response?.data || error.message);
      showAlert('error', 'Failed to update response.');
      throw new Error(error.response?.data?.message || "Failed to update response.");
    }
  };

  const fetchApplication = async (applicationId) => {
    try {
      const response = await axiosInstance.get(`/api/Applications/show/${applicationId}`);
      // showAlert('success', 'Application fetched successfully.');
      return response.data;
    } catch (error) {
      console.error("Error fetching application:", error.response?.data || error.message);
      showAlert('error', 'Failed to fetch application.');
      throw new Error(error.response?.data?.message || "Failed to fetch application.");
    }
  };

  const deleteApplication = async (applicationId) => {
    try {
      await axiosInstance.delete(`/api/Applications/delete/${applicationId}`);
      setApplications(applications.filter((app) => app.id !== applicationId));
      // showAlert('success', 'Job application deleted successfully.');
    } catch (error) {
      console.error("Error deleting application:", error.response?.data || error.message);
      showAlert('error', 'Failed to delete job application.');
      throw new Error(error.response?.data?.message || "Failed to delete application.");
    }
  };

  const compareSalary = async (applications) => {
    try {
      const companies = applications.map((app) => app.company);
      const jobTitles = applications.map((app) => app.jobTitle);
      const locations = applications.map((app) => app.location);

      const payload = {
        companies,
        jobTitles,
        locations,
      };

      const response = await axiosInstance2.post("/compareSalary", { data: payload });

      if (response.data.answer) {
        // showAlert('success', 'Salary comparison completed successfully.');
        return { answer: response.data.answer, links: response.data.links };
      } else {
        throw new Error("Cannot compare salaries.");
      }
    } catch (error) {
      console.error("Error comparing salary:", error.response?.data || error.message);
      showAlert('error', 'Failed to compare salaries.');
      throw error;
    }
  };

  const getInterviewQuestions = async (company, jobTitle) => {
    try {
      const payload = {
        company,
        jobTitle,
      };

      const response = await axiosInstance2.post("/interviewQuestions", { data: payload });

      if (response.data.answer) {
        // showAlert('success', 'Interview questions fetched successfully.');
        return { answer: response.data.answer, links: response.data.links };
      } else {
        throw new Error("No questions returned.");
      }
    } catch (error) {
      console.error("Error fetching interview questions:", error.response?.data || error.message);
      showAlert('error', 'Failed to fetch interview questions.');
      throw new Error(error.response?.data?.message || "Failed to fetch interview questions.");
    }
  };

  return (
    <JobApplicationsContext.Provider
      value={{
        applications,
        addApplication,
        updateApplication,
        fetchApplicationResponses,
        addResponse,
        deleteResponse,
        editResponse,
        fetchApplication,
        deleteApplication,
        compareSalary,
        getInterviewQuestions,
      }}
    >
      {children}
    </JobApplicationsContext.Provider>
  );
};

export { JobApplicationsContext, JobApplicationsProvider };