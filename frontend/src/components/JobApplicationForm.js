import React, { useState, useEffect } from 'react';
import '../design/JobApplicationForm.css';

const JobApplicationForm = ({ onSubmit, initialData }) => {
  const [company, setCompany] = useState('');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [link, setLink] = useState('');
  const [date, setDate] = useState('');
  const [availability, setAvailability] = useState('On site')
  const [status, setStatus] = useState('Applied');

  useEffect(() => {
    if (initialData) {
      setCompany(initialData.company || '');
      setTitle(initialData.title || '')
      setLocation(initialData.location || '')
      setLink(initialData.link || '');
      setDate(initialData.date || '');
      setAvailability(initialData.availability || 'On site')
      setStatus(initialData.status || 'Applied');
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ company, title, location, link, date, availability, status });
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
        <input type="text" value={location} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div>
        <label>Application Date:</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      </div>
      <div>
        <label>Availability:</label>
        <select value={availability} onChange={(e) => setStatus(e.target.value)} required>
          <option value="On site">On site</option>
          <option value="Remote">Remote</option>
          <option value="Hybrid">Interview</option>
        </select>
      </div>
      <div>
        <label>Status:</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)} required>
          <option value="Applied">Applied</option>
          <option value="Online Assessment">Online Assessment</option>
          <option value="Interview">Interview</option>
          <option value="Offer">Offer</option>
          <option value="Hired">Hired</option>
        </select>
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default JobApplicationForm;