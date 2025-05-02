import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const JobApplicationsContext = createContext();

const JobApplicationsProvider = ({ children }) => {
  const mockApplications = [
    {
      company: 'Company A',
      title: 'Software Engineer',
      location: 'New York',
      link: 'https://companya.com',
      date: '2023-10-01',
      availability: 'On site',
      status: 'Applied',
      onlineAssessmentDeadline: '2023-10-10',
      interviewDate: '2023-10-15'
    },
    {
      company: 'Company B',
      title: 'Data Scientist',
      location: 'San Francisco',
      link: 'https://companyb.com',
      date: '2023-09-15',
      availability: 'Remote',
      status: 'Online Assessment',
      onlineAssessmentDeadline: '2023-09-25',
      interviewDate: ''
    },
    {
      company: 'Company C',
      title: 'Product Manager',
      location: 'Chicago',
      link: 'https://companyc.com',
      date: '2023-08-20',
      availability: 'Hybrid',
      status: 'Interview',
      onlineAssessmentDeadline: '',
      interviewDate: '2023-09-05'
    }
  ];

  const [applications, setApplications] = useState(mockApplications);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/Applications/index`);
        setApplications(response.data);
      } catch (error) {
        console.error('Error fetching job applications:', error);
      }
    };

    fetchApplications();
  }, []); 

  const addApplication = async (application) => {
    try {
        const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/Applications/new`, application);
        setApplications([...applications, response.data]);
    } catch (error) {
        console.error('Error adding job application:', error);
    }
  };

  const updateApplication = async (index, updatedApplication) => {
    try {
        const response = await axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/Applications/edit/${updatedApplication.id}`, updatedApplication);
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