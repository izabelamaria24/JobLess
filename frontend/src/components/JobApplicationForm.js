import React, { useState, useEffect } from 'react';
import '../design/JobApplicationForm.css';

const JobApplicationForm = ({ onSubmit, initialData }) => {
  const [company, setCompany] = useState('');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [link, setLink] = useState('');
  const [date, setDate] = useState('');
  const [jobType, setJobType] = useState(0); 
  const [availability, setAvailability] = useState(0); 
  const [status, setStatus] = useState(0);
  const [onlineAssessmentDeadline, setOnlineAssessmentDeadline] = useState('');
  const [interviewDate, setInterviewDate] = useState('');

  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (initialData) {
      setCompany(initialData.company || '');
      setTitle(initialData.title || '');
      setLocation(initialData.location || '');
      setLink(initialData.link || '');
      setDate(initialData.date || '');
      setJobType(initialData.jobType || 0);
      setAvailability(initialData.availability || 0);
      setStatus(initialData.status || 0);
      setOnlineAssessmentDeadline(initialData.onlineAssessmentDeadline || '');
      setInterviewDate(initialData.interviewDate || '');
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true)
  
    if (jobType === 0 || availability === 0 || status === 0) {
      setError("Please select valid options for Job Type, Availability, and Status.");
      return;
    }
  
    try {
      await onSubmit({
        company,
        title,
        location,
        link,
        date,
        jobType,
        availability,
        status,
        onlineAssessmentDeadline,
        interviewDate,
      });
      setIsLoading(false)
    } catch (err) {
      setIsLoading(false)
      setError("Failed to submit the application. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="job-application-form">
      <div>
        <label>Company Name:</label>
        <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} required />
      </div>
      <div>
        <label>Job Title:</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div>
        <label>Company Link:</label>
        <input type="url" value={link} onChange={(e) => setLink(e.target.value)} required />
      </div>
      <div>
        <label>Location:</label>
        <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required />
      </div>
      <div>
        <label>Application Date:</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      </div>
      <div>
        <label>Job Type:</label>
        <select value={jobType} onChange={(e) => setJobType(parseInt(e.target.value))} required>
          <option value="0">Select Job Type</option>
          <option value="1">Full Time</option>
          <option value="2">Part Time</option>
          <option value="3">Internship</option>
          <option value="4">Freelance</option>
          <option value="5">Temporary</option>
        </select>
      </div>
      <div>
        <label>Availability:</label>
        <select value={availability} onChange={(e) => setAvailability(parseInt(e.target.value))} required>
          <option value="0">Select Availability</option>
          <option value="1">Remote</option>
          <option value="2">Hybrid</option>
          <option value="3">On Site</option>
        </select>
      </div>
      <div>
        <label>Status:</label>
        <select value={status} onChange={(e) => setStatus(parseInt(e.target.value))} required>
          <option value="0">Select Status</option>
          <option value="1">Active</option>
          <option value="2">Offer</option>
          <option value="3">Rejected</option>
          <option value="4">Accepted</option>
        </select>
      </div>
      {status === 2 && (
        <div>
          <label>Online Assessment Deadline:</label>
          <input type="date" value={onlineAssessmentDeadline} onChange={(e) => setOnlineAssessmentDeadline(e.target.value)} />
        </div>
      )}
      {status === 3 && (
        <div>
          <label>Interview Date:</label>
          <input type="date" value={interviewDate} onChange={(e) => setInterviewDate(e.target.value)} />
        </div>
      )}

      {error && <p className="error-message">{error}</p>}
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
};

export default JobApplicationForm;