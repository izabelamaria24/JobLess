import React from 'react';
import '../design/JobApplication.css';

const statusSteps = ['Applied', 'Online Assessment', 'Interview', 'Offer', 'Hired'];

const JobApplication = ({ company, link, date, status }) => {
  const currentStep = statusSteps.indexOf(status);

  return (
    <div className="job-application">
      <h3>{company}</h3>
      <p><a href={link} target="_blank" rel="noopener noreferrer">Company Link</a></p>
      <p>Application Date: {date}</p>
      <div className="progress-container">
        {statusSteps.map((step, index) => (
          <div key={index} className={`progress-step ${index <= currentStep ? 'completed' : ''}`}>
            <div className="step-number">{index + 1}</div>
            <div className="step-label">{step}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobApplication;