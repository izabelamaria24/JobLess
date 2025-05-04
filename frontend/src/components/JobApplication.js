import React, { useContext, useEffect, useState } from 'react';
import { JobApplicationsContext } from '../context/JobApplicationsContext';
import '../design/JobApplication.css';

const statusSteps = ['Applied', 'Online Assessment', 'Interview', 'Offer', 'Hired'];

const JobApplication = ({ applicationId, company, jobTitle, location, availability, link, date, onEdit }) => {
  const {fetchApplicationResponses} = useContext(JobApplicationsContext)
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    const fetchResponses = async () => {
      const applicationResponses = await fetchApplicationResponses(applicationId);
      setResponses(applicationResponses);

      if (applicationResponses.length > 0) {
        const lastAction = applicationResponses[applicationResponses.length - 1].action;
        if (lastAction === 1) setCurrentStep(0); 
        else if (lastAction >= 2 && lastAction <= 4) setCurrentStep(1); 
        else if (lastAction >= 5 && lastAction <= 12) setCurrentStep(2); 
        else if (lastAction >= 13 && lastAction <= 15) setCurrentStep(3); 
        else if (lastAction === 16) setCurrentStep(4); 
      }
    };

    fetchResponses();
  }, [applicationId]);

  return (
    <div className="job-application">
      <div className="job-application-header">
        <div>
          <h3>{company}</h3>
          <h3>{jobTitle}</h3>
          <h3>{location}</h3>
        </div>
        <div className="job-application-dates">
          {currentStep >= 0 && <p>Application Date: {date}</p>}
        </div>
      </div>
      <p><a href={link} target="_blank" rel="noopener noreferrer">Company Link</a></p>
      <div className="progress-container">
        {statusSteps.map((step, index) => (
          <div key={index} className={`progress-step ${index <= currentStep ? 'completed' : ''}`}>
            <div className="step-number">{index + 1}</div>
            <div className="step-label">{step}</div>
          </div>
        ))}
      </div>
      <p className="availability-text">{availability}</p>
      <button className="edit-application-button" onClick={onEdit}>Edit</button>
    </div>
  );
};

export default JobApplication;