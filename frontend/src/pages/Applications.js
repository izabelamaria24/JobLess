import React, { useState, useContext } from 'react';
import JobApplication from '../components/JobApplication';
import JobApplicationForm from '../components/JobApplicationForm';
import Modal from '../components/Modal';
import { JobApplicationsContext } from '../context/JobApplicationsContext';
import "../design/Applications.css"; 
import { Link, useNavigate } from 'react-router-dom';
import Alert from '../components/Alert'; 
import { useAlert } from '../utils/useAlert'; 
import axiosInstance from '../utils/axiosInstance';


const Applications = () => {
  const { applications, addApplication, updateApplication, compareSalary, fetchApplications } = useContext(JobApplicationsContext);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [currentApplication, setCurrentApplication] = useState(null);
  const [staleApplications, setStaleApplications] = useState([]);

  const navigate = useNavigate();
  const { alert, showAlert, closeAlert } = useAlert(); 

  const handleAddApplication = async (application) => {
    try {
      await addApplication(application);
      setIsFormVisible(false);
      showAlert('success', 'Job application added successfully.');
      if (fetchApplications) await fetchApplications();
    } catch (err) {
      showAlert('error', err.message || 'Failed to add job application.');
    }
  };

  const handleEditApplication = (index) => {
    setCurrentApplication({ ...applications[index], index });
    setIsFormVisible(true);
  };

  const handleUpdateApplication = async (updatedApplication) => {
    try {
      await updateApplication(currentApplication.index, updatedApplication);
      setIsFormVisible(false);
      setCurrentApplication(null);
      showAlert('success', 'Job application updated successfully.');
      if (fetchApplications) await fetchApplications();
    } catch (err) {
      showAlert('error', err.message || 'Failed to update job application.');
    }
  };

  const handleCompareSalary = async () => {
    navigate("/compare-salary");
  }

  const handleGetInterviewQuestions = async () => {
    navigate("/interview-questions");
  }

  const highlightStaleApplications = async () => {
    try {
      const response = await axiosInstance.get('/api/Responses/stale-actions');

      let staleApplicationIds = response.data.map(app => app.id);
    
      setStaleApplications(staleApplicationIds);
    } catch (err) {
      console.error('Error fetching stale applications:', err);
    }
  }

  return (
    <div className="applications-page">
      <h1>Job Applications</h1>
      <button className="add-application-button" onClick={() => { setIsFormVisible(true); setCurrentApplication(null); }}>Add New Job Application</button>
      <button className="compare-salary-button" onClick={handleCompareSalary}>Compare Salaries</button>
      <button className="add-application-button" onClick={handleGetInterviewQuestions}>Get Interview Questions</button>
      <button className="add-application-button" onClick={ highlightStaleApplications }>Highlight Stale Applications</button>

      
      <Modal isVisible={isFormVisible} onClose={() => setIsFormVisible(false)}>
        <JobApplicationForm
          onSubmit={currentApplication ? handleUpdateApplication : handleAddApplication}
          initialData={currentApplication}
        />
      </Modal>

      {applications.map((app, index) => (
        <div key={index}>
          <JobApplication
            applicationId={app.id}
            company={app.company}
            jobTitle={app.jobTitle}
            availability={app.availability}
            location={app.location}
            link={app.link}
            date={app.date}
            status={app.status}
            onlineAssessmentDeadline={app.onlineAssessmentDeadline}
            interviewDate={app.interviewDate}
            isStale={staleApplications.includes(app.id)}
            onEdit={() => handleEditApplication(index)}
          />
        </div>
      ))}

      {alert.show && (
        <Alert type={alert.type} message={alert.message} onClose={closeAlert} />
      )}
    </div>
  );
};

export default Applications;