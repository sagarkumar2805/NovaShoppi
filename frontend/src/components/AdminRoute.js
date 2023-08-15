// Import necessary dependencies
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { Store } from '../Store';

// Create a functional component called AdminRoute that takes a "children" prop
export default function AdminRoute({ children }) {
  // Use the useContext hook to access the Store context
  const { state } = useContext(Store);

  // Extract the "userInfo" object from the context state
  const { userInfo } = state;

  // Check if the user is logged in and has admin privileges
  // If the user is an admin, render the provided children components,
  // otherwise, redirect to the sign-in page
  return userInfo && userInfo.isAdmin ? children : <Navigate to="/signin" />;
}
