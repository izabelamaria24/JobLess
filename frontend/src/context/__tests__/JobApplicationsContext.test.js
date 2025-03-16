
import React from 'react';
import { render, waitFor } from '@testing-library/react';
import axios from 'axios';
import { JobApplicationsProvider, JobApplicationsContext } from '../JobApplicationsContext';

jest.mock('axios');

const mockApplications = [
  { id: 1, company: 'Company A', link: 'https://companya.com', date: '2025-03-01', status: 'Applied' },
  { id: 2, company: 'Company B', link: 'https://companyb.com', date: '2025-03-05', status: 'Online Assessment' }
];

test('fetches and provides job applications', async () => {
  axios.get.mockResolvedValueOnce({ data: mockApplications });

  let applications;
  const TestComponent = () => {
    const context = React.useContext(JobApplicationsContext);
    applications = context.applications;
    return null;
  };

  render(
    <JobApplicationsProvider>
      <TestComponent />
    </JobApplicationsProvider>
  );

  await waitFor(() => expect(applications).toEqual(mockApplications));
});