import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Dashboard from '../Dashboard';

test('renders dashboard with routes', () => {
  render(
    <Router>
      <Dashboard />
    </Router>
  );

  expect(screen.getByText('Home')).toBeInTheDocument();
  expect(screen.getByText('Applications')).toBeInTheDocument();
  expect(screen.getByText('Profile')).toBeInTheDocument();
  expect(screen.getByText('Statistics')).toBeInTheDocument();
});