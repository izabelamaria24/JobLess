import React from 'react';
import JobApplication from '../components/JobApplication';
import "../design/Applications.css"; 

const applications = [
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
  return (
    <div className="applications-page">
      <h1>Job Applications</h1>
      {applications.map((app, index) => (
        <JobApplication
          key={index}
          company={app.company}
          link={app.link}
          date={app.date}
          status={app.status}
        />
      ))}
    </div>
  );
};

export default Applications;