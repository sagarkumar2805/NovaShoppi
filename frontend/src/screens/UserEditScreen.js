import axios from 'axios';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store';
import { getError } from '../utils';
import { BASE_URL } from "../config";


// Reducer to manage component state during fetch and update actions
const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false };
    default:
      return state;
  }
};

export default function UserEditScreen() {
  // Use reducer to manage component state
  const [{ loading, error, loadingUpdate }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  // Get user info from global state
  const { state } = useContext(Store);
  const { userInfo } = state;

  // Get user ID from URL parameters
  const params = useParams();
  const { id: userId } = params;

  // Get navigation function
  const navigate = useNavigate();

  // Define local state for user data
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  // Fetch user data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(BASE_URL+`/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        // Set local state with fetched user data
        setName(data.name);
        setEmail(data.email);
        setIsAdmin(data.isAdmin);
        dispatch({ type: 'FETCH_SUCCESS' });
      } catch (err) {
        // Handle fetch error
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [userId, userInfo]);

  // Handler for user data update
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: 'UPDATE_REQUEST' });
      // Send user data update request to the API
      await axios.put(BASE_URL+
        `/api/users/${userId}`,
        { _id: userId, name, email, isAdmin },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      // Handle update success
      dispatch({ type: 'UPDATE_SUCCESS' });
      toast.success('User updated successfully');
      navigate('/admin/users'); // Navigate back to the user list
    } catch (error) {
      // Handle update failure
      toast.error(getError(error));
      dispatch({ type: 'UPDATE_FAIL' });
    }
  };

  return (
    <Container className="small-container">
      <Helmet>
        <title>Edit User ${userId}</title>
      </Helmet>
      <h1>Edit User {userId}</h1>

      {loading ? (
        // Display loading spinner while fetching data
        <LoadingBox></LoadingBox>
      ) : error ? (
        // Display error message if fetching data fails
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        // Display user edit form
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              value={email}
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          {/* Checkbox for isAdmin */}
          <Form.Check
            className="mb-3"
            type="checkbox"
            id="isAdmin"
            label="isAdmin"
            checked={isAdmin}
            onChange={(e) => setIsAdmin(e.target.checked)}
          />

          <div className="mb-3">
            {/* Submit button */}
            <Button disabled={loadingUpdate} type="submit">
              Update
            </Button>
            {loadingUpdate && <LoadingBox></LoadingBox>}
          </div>
        </Form>
      )}
    </Container>
  );
}
