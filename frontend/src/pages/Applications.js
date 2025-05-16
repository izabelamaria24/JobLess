import React, { useState, useContext } from 'react';
import JobApplication from '../components/JobApplication';
import JobApplicationForm from '../components/JobApplicationForm';
import Modal from '../components/Modal';
import { JobApplicationsContext } from '../context/JobApplicationsContext';
import "../design/Applications.css"; 
import { Link, useNavigate } from 'react-router-dom';
import Alert from '../components/Alert'; 
import { useAlert } from '../utils/useAlert'; 

const Applications = () => {
  const { applications, addApplication, updateApplication, compareSalary } = useContext(JobApplicationsContext);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [currentApplication, setCurrentApplication] = useState(null);

  const navigate = useNavigate();
  const { alert, showAlert, closeAlert } = useAlert(); 

  const handleAddApplication = async (application) => {
    try {
      await addApplication(application);
      setIsFormVisible(false);
      showAlert('success', 'Job application added successfully.');
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
    } catch (err) {
      showAlert('error', err.message || 'Failed to update job application.');
    }
  };

  const handleCompareSalary = async () => {
    try {
      const { answer, links } = await compareSalary(applications); 
      navigate("/compare-salary", { state: { answer, links } }); 
      showAlert('success', 'Salary comparison completed successfully.');
    } catch (err) {
      showAlert('error', err.message || 'Error comparing salaries.');
    }
  };

  return (
    <div className="applications-page">
      <h1>Job Applications</h1>
      <button className="add-application-button" onClick={() => { setIsFormVisible(true); setCurrentApplication(null); }}>Add New Job Application</button>
      <button className="compare-salary-button" onClick={handleCompareSalary}>Compare Salaries</button>
      
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
            onEdit={() => handleEditApplication(index)}
          />
          <Link to={`/applications/${app.id}`}><button className='show-application-button'>Show</button></Link>
        </div>
      ))}

      {alert.show && (
        <Alert type={alert.type} message={alert.message} onClose={closeAlert} />
      )}
    </div>
  );
};

export default Applications;