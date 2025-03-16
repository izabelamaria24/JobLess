import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AuthProvider } from '../../context/AuthContext';
import AuthPage from '../AuthPage';

test('renders login form and switches to register form', () => {
  render(
    <AuthProvider>
      <AuthPage />
    </AuthProvider>
  );

  expect(screen.getByText('Welcome Back!')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();

  fireEvent.click(screen.getByText('Need an account? Register'));

  expect(screen.getByText('Create an Account')).toBeInTheDocument();
  expect(screen.getByText('Already have an account? Login')).toBeInTheDocument();
});