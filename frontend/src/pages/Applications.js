// filepath: /home/izabelamaria/Coding/JobLess/frontend/src/pages/Applications.js
import React, { useState } from 'react';
import JobApplication from '../components/JobApplication';
import JobApplicationForm from '../components/JobApplicationForm';
import Modal from '../components/Modal';
import "../design/Applications.css"; 

const initialApplications = [
  {
    company: 'Company A',
    link: 'https://companya.com',
    date: '2025-03-01',
    status: 'Applied'
  },
  {
    company: 'Company B',
    link: 'https://companyb.com',
    date: '2025-03-05',
    status: 'Online Assessment'
  },
  {
    company: 'Company C',
    link: 'https://companyc.com',
    date: '2025-03-10',
    status: 'Interview'
  }
];

const Applications = () => {
  const [applications, setApplications] = useState(initialApplications);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [currentApplication, setCurrentApplication] = useState(null);

  const handleAddApplication = (application) => {
    setApplications([...applications, application]);
    setIsFormVisible(false);
  };

  const handleEditApplication = (index) => {
    setCurrentApplication({ ...applications[index], index });
    setIsFormVisible(true);
  };

  const handleUpdateApplication = (updatedApplication) => {
    const updatedApplications = applications.map((app, index) =>
      index === currentApplication.index ? updatedApplication : app
    );
    setApplications(updatedApplications);
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