import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { Store } from '../Store';

// Component to protect routes by checking user authentication
export default function ProtectedRoute({ children }) {
  // Use context to access user information from global state
  const { state } = useContext(Store);
  const { userInfo } = state;

  // If user is authenticated (userInfo exists), render the children (protected content)
  // Otherwise, redirect to the signin page
  return userInfo ? children : <Navigate to="/signin" />;
}
