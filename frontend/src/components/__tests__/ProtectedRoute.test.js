import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import ProtectedRoute from '../ProtectedRoute';

const TestComponent = () => <div>Protected Content</div>;

test('renders protected content when user is authenticated', () => {
  const mockUser = { name: 'Test User' };

  const { getByText } = render(
    <AuthContext.Provider value={{ user: mockUser }}>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <TestComponent />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );

  expect(getByText('Protected Content')).toBeInTheDocument();
});

test('redirects to login when user is not authenticated', () => {
  const { queryByText } = render(
    <AuthContext.Provider value={{ user: null }}>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <TestComponent />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );

  expect(queryByText('Protected Content')).not.toBeInTheDocument();
  expect(queryByText('Login Page')).toBeInTheDocument();
});