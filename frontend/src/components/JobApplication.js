import React, { useContext, useEffect, useState, useCallback, useRef } from 'react';
import { JobApplicationsContext } from '../context/JobApplicationsContext';
import Alert from './Alert';
import { useAlert } from '../utils/useAlert';
import '../design/JobApplication.css';
import { useNavigate } from 'react-router-dom';

const statusSteps = ['Applied', 'Online Assessment', 'Interview', 'Offer', 'Hired'];

const JobApplication = ({ applicationId, company, jobTitle, location, availability, link, date, isStale, onEdit }) => {
  const { fetchApplicationResponses } = useContext(JobApplicationsContext);
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState([]);
  const { alert, showAlert, closeAlert } = useAlert(); 
  const [loading, setLoading] = useState(false);
  const requestInProgress = useRef(false);
  const navigate = useNavigate();
  
  const stableShowAlert = useCallback((type, message) => {
    showAlert(type, message);
  }, [showAlert]);

  const fetchResponses = useCallback(async () => {
    if (requestInProgress.current) return;
    
    try {
      requestInProgress.current = true;
      setLoading(true);
      const applicationResponses = await fetchApplicationResponses(applicationId);
      setResponses(applicationResponses);

      if (applicationResponses.length > 0) {
        const lastResponse = applicationResponses[0];
        const actionValue = lastResponse.action;
        
        if (actionValue === 1) setCurrentStep(0);
        else if (actionValue >= 2 && actionValue <= 4) setCurrentStep(1);
        else if (actionValue >= 5 && actionValue <= 12) setCurrentStep(2);
        else if (actionValue >= 13 && actionValue <= 15) setCurrentStep(3);
        else if (actionValue === 16) setCurrentStep(4);
      }
    } catch (error) {
      console.error("Error in fetchResponses:", error);
      if (!error.response || error.response.status !== 404) {
        showAlert('error', 'Failed to fetch application responses.');
      }
    } finally {
      setLoading(false);
    }
  }, [applicationId, fetchApplicationResponses, stableShowAlert]);

  useEffect(() => {
    fetchResponses();
    
    // Clean up function to handle component unmounting
    return () => {
      // Any cleanup if needed
    };
  }, [fetchResponses]);

  return (
    <div className={`job-application ${isStale ? 'stale' : ''}`}>
      <div className="job-application-header">
        <div>
          <h3>{company}</h3>
          <h3>{jobTitle}</h3>
          <h3>{location}</h3>
        </div>
        <div className="job-application-dates">
          {currentStep >= 0 && <p>Application Date: {date}</p>}
          {isStale && <div className="stale-badge">This application has not received any responses in the last 28 days</div>}
        </div>
      </div>
      <p><a href={link} target="_blank" rel="noopener noreferrer">Company Link</a></p>
      <div className={`progress-container ${isStale ? 'stale' : ''}`}>
        {statusSteps.map((step, index) => (
          <div key={index} className={`progress-step ${index <= currentStep ? 'completed' : ''}`}>
            <div className="step-number">{index + 1}</div>
            <div className="step-label">{step}</div>
          </div>
        ))}
      </div>
      
      <p className="availability-text">{availability}</p>
      <button className="edit-application-button" onClick={onEdit}>Edit</button>
      <button className="edit-application-button" onClick={() => navigate(`/applications/${applicationId}`)}>Show</button>

      {alert.show && (
        <Alert type={alert.type} message={alert.message} onClose={closeAlert} />
      )}
    </div>
  );
};

export default JobApplication;