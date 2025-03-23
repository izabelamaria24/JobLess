import React from 'react';
import '../design/JobApplication.css';

const statusSteps = ['Applied', 'Online Assessment', 'Interview', 'Offer', 'Hired'];

const JobApplication = ({ company, title, location, availability, link, date, status, onlineAssessmentDeadline, interviewDate, onEdit }) => {
  const currentStep = status === 'Rejected' ? statusSteps.indexOf(status) - 1 : statusSteps.indexOf(status);

  return (
    <div className="job-application">
      <div className="job-application-header">
        <div>
          <h3>{company}</h3>
          <h3>{title}</h3>
          <h3>{location}</h3>
        </div>
        <div className="job-application-dates">
          {currentStep >= 0 && <p>Application Date: {date}</p>}
          {currentStep >= 1 && onlineAssessmentDeadline && <p>Online Assessment Deadline: {onlineAssessmentDeadline}</p>}
          {currentStep >= 2 && interviewDate && <p>Interview Date: {interviewDate}</p>}
        </div>
      </div>
      <p><a href={link} target="_blank" rel="noopener noreferrer">Company Link</a></p>
      <div className="progress-container">
        {status !== 'Rejected' ? (
          statusSteps.map((step, index) => (
            <div key={index} className={`progress-step ${index <= currentStep ? 'completed' : ''}`}>
              <div className="step-number">{index + 1}</div>
              <div className="step-label">{step}</div>
              {step === 'Interview' && index <= currentStep && interviewDate && (
                <b><div className="step-date">{interviewDate}</div></b>
              )}
            </div>
          ))
        ) : (
          statusSteps.slice(0, currentStep + 1).map((step, index) => (
            <div key={index} className="progress-step rejected">
              <div className="step-number">{index + 1}</div>
              <div className="step-label">{step}</div>
              {step === 'Interview' && index <= currentStep && interviewDate && (
                <b><div className="step-date">{interviewDate}</div></b>
              )}
            </div>
          )).concat(
            <div className="progress-step rejected">
              <div className="step-number">{currentStep + 2}</div>
              <div className="step-label">Rejected</div>
            </div>
          )
        )}
      </div>
      <p className="availability-text">{availability}</p>
      <button className="edit-application-button" onClick={onEdit}>Edit</button>
    </div>
  );
};

export default JobApplication;