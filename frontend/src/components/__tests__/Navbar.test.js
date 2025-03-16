import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from '../Navbar';

test('renders navbar with links', () => {
  render(
    <Router>
      <Navbar />
    </Router>
  );

  expect(screen.getByText('JobLess')).toBeInTheDocument();
  expect(screen.getByText('Dashboard')).toBeInTheDocument();
  expect(screen.getByText('Applications')).toBeInTheDocument();
  expect(screen.getByText('Profile')).toBeInTheDocument();
  expect(screen.getByText('Statistics')).toBeInTheDocument();
});