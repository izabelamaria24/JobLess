import React from 'react';
import { render, screen } from '@testing-library/react';
import ApplicationComponent from '../ApplicationComponent';

test('renders job application with company name, link, date, and status', () => {
  const application = {
    company: 'Company A',
    link: 'https://companya.com',
    date: '2025-03-01',
    status: 'Applied'
  };

  render(<ApplicationComponent {...application} />);

  expect(screen.getByText('Company A')).toBeInTheDocument();
  expect(screen.getByText('Company Link')).toBeInTheDocument();
  expect(screen.getByText('Application Date: 2025-03-01')).toBeInTheDocument();
  expect(screen.getByText('Applied')).toBeInTheDocument();
});