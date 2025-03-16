import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { JobApplicationsProvider } from '../../context/JobApplicationsContext';
import Applications from '../Applications';

test('renders applications page and adds a new job application', async () => {
  render(
    <JobApplicationsProvider>
      <Applications />
    </JobApplicationsProvider>
  );

  expect(screen.getByText('Job Applications')).toBeInTheDocument();

  fireEvent.click(screen.getByText('Add New Job Application'));

  fireEvent.change(screen.getByLabelText('Company Name:'), { target: { value: 'Company C' } });
  fireEvent.change(screen.getByLabelText('Company Link:'), { target: { value: 'https://companyc.com' } });
  fireEvent.change(screen.getByLabelText('Application Date:'), { target: { value: '2025-03-10' } });
  fireEvent.change(screen.getByLabelText('Status:'), { target: { value: 'Interview' } });

  fireEvent.click(screen.getByText('Submit'));

  expect(await screen.findByText('Company C')).toBeInTheDocument();
});