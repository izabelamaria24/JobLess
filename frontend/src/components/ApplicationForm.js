import React, { useState, useEffect } from 'react';
import Alert from './Alert';
import { useAlert } from '../utils/useAlert';
import '../design/ApplicationForm.css';

const ApplicationForm = ({ onSubmit, initialData }) => {
  const getTodayFormatted = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const [company, setCompany] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [location, setLocation] = useState('');
  const [link, setLink] = useState('');
  const [date, setDate] = useState(getTodayFormatted());
  const [jobType, setJobType] = useState(0);
  const [availability, setAvailability] = useState(0);
  const [status, setStatus] = useState(0);
  const [onlineAssessmentDeadline, setOnlineAssessmentDeadline] = useState('');
  const [interviewDate, setInterviewDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { alert, showAlert, closeAlert } = useAlert();

  useEffect(() => {
    if (initialData) {
      setCompany(initialData.company || '');
      setJobTitle(initialData.jobTitle || '');
      setLocation(initialData.location || '');
      setLink(initialData.link || '');

      if (initialData.date) {
        if (initialData.date.includes('-') && initialData.date.length === 10) {
          setDate(initialData.date);
        } else {
          try {
            const dateObj = new Date(initialData.date);
            if (!isNaN(dateObj.getTime())) {
              setDate(dateObj.toISOString().split('T')[0]);
            } else {
              setDate(getTodayFormatted());
            }
          } catch (e) {
            setDate(getTodayFormatted());
          }
        }
      } else {
        setDate(getTodayFormatted());
      }

      setJobType(initialData.jobType || 0);
      setAvailability(initialData.availability || 0);
      setStatus(initialData.status || 0);
      setOnlineAssessmentDeadline(initialData.onlineAssessmentDeadline || '');
      setInterviewDate(initialData.interviewDate || '');
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (jobType === 0 || availability === 0 || status === 0) {
      showAlert('error', 'Please select valid options for Job Type, Availability, and Status.');
      setIsLoading(false);
      return;
    }

    try {
      await onSubmit({
        company,
        jobTitle,
        location,
        link,
        date,
        jobType,
        availability,
        status,
        onlineAssessmentDeadline,
        interviewDate,
      });
      setIsLoading(false);
      // No success alert here, let the parent handle it
    } catch (err) {
      setIsLoading(false);
      showAlert('error', 'Failed to submit the application. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="profile-card job-application-form">
      <h2 className="profile-section-title">{initialData ? 'Edit Job Application' : 'Add New Job Application'}</h2>
      <div className="job-application-form-grid">
        <div className="profile-form-group">
          <label>Company Name:</label>
          <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} required className="profile-input" />
        </div>
        <div className="profile-form-group">
          <label>Job Title:</label>
          <input type="text" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} required className="profile-input" />
        </div>
        <div className="profile-form-group">
          <label>Company Link:</label>
          <input type="url" value={link} onChange={(e) => setLink(e.target.value)} required className="profile-input" />
        </div>
        <div className="profile-form-group">
          <label>Location:</label>
          <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required className="profile-input" />
        </div>
        <div className="profile-form-group">
          <label>Application Date:</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="profile-input" />
        </div>
        <div className="profile-form-group">
          <label>Job Type:</label>
          <select value={jobType} onChange={(e) => setJobType(parseInt(e.target.value))} required className="profile-input">
            <option value="0">Select Job Type</option>
            <option value="1">Full Time</option>
            <option value="2">Part Time</option>
            <option value="3">Internship</option>
            <option value="4">Freelance</option>
            <option value="5">Temporary</option>
          </select>
        </div>
        <div className="profile-form-group">
          <label>Availability:</label>
          <select value={availability} onChange={(e) => setAvailability(parseInt(e.target.value))} required className="profile-input">
            <option value="0">Select Availability</option>
            <option value="1">Remote</option>
            <option value="2">Hybrid</option>
            <option value="3">On Site</option>
          </select>
        </div>
        <div className="profile-form-group">
          <label>Status:</label>
          <select value={status} onChange={(e) => setStatus(parseInt(e.target.value))} required className="profile-input">
            <option value="0">Select Status</option>
            <option value="1">Active</option>
            <option value="2">Offer</option>
            <option value="3">Rejected</option>
            <option value="4">Accepted</option>
          </select>
        </div>
      </div>

      <div className="form-footer profile-buttons">
        <button type="submit" disabled={isLoading} className="profile-button">
          {isLoading ? 'Submitting...' : initialData ? 'Update Application' : 'Add Application'}
        </button>
      </div>

      {alert.show && (
        <Alert type={alert.type} message={alert.message} onClose={closeAlert} />
      )}
    </form>
  );
};

export default ApplicationForm;