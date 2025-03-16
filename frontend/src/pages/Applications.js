import React, { useState, useContext } from 'react';
import JobApplication from '../components/JobApplication';
import JobApplicationForm from '../components/JobApplicationForm';
import Modal from '../components/Modal';
import { JobApplicationsContext } from '../context/JobApplicationsContext';
import "../design/Applications.css"; 

const Applications = () => {
  const { applications, addApplication, updateApplication } = useContext(JobApplicationsContext);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [currentApplication, setCurrentApplication] = useState(null);

  const handleAddApplication = (application) => {
    addApplication(application);
    setIsFormVisible(false);
  };

  const handleEditApplication = (index) => {
    setCurrentApplication({ ...applications[index], index });
    setIsFormVisible(true);
  };

  const handleUpdateApplication = (updatedApplication) => {
    updateApplication(currentApplication.index, updatedApplication);
    setIsFormVisible(false);
    setCurrentApplication(null);
  };

  return (
    <div className="applications-page">
      <h1>Job Applications</h1>
      <button onClick={() => { setIsFormVisible(true); setCurrentApplication(null); }}>Add New Job Application</button>
      <Modal isVisible={isFormVisible} onClose={() => setIsFormVisible(false)}>
        <JobApplicationForm
          onSubmit={currentApplication ? handleUpdateApplication : handleAddApplication}
          initialData={currentApplication}
        />
      </Modal>
      {applications.map((app, index) => (
        <div key={index}>
          <JobApplication
            company={app.company}
            link={app.link}
            date={app.date}
            status={app.status}
          />
          <button onClick={() => handleEditApplication(index)}>Edit</button>
        </div>
      ))}
    </div>
  );
};

export default Applications;