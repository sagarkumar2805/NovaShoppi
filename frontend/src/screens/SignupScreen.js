import Axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import { useContext, useEffect, useState } from 'react';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import { BASE_URL } from "../config";

export default function SignupScreen() {
  // Get navigation function and redirect URL from location
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';

  // Local state for form input values
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Get user info from global state and dispatch function
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  // Handler for form submission
  const submitHandler = async (e) => {
    e.preventDefault();
    // Check if passwords match
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      // Send signup request to the API
      const { data } = await Axios.post(BASE_URL+'/api/users/signup', {
        name,
        email,
        password,
      });
      // Update global state with user info
      ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      // Save user info to local storage
      localStorage.setItem('userInfo', JSON.stringify(data));
      // Navigate to the redirect URL or the homepage
      navigate(redirect || '/');
    } catch (err) {
      // Handle signup error
      toast.error(getError(err));
    }
  };

  // Check if the user is already signed in, and navigate if necessary
  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  return (
    <Container className="small-container">
      <Helmet>
        <title>Sign Up</title>
      </Helmet>
      <h1 className="my-3">Sign Up</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control onChange={(e) => setName(e.target.value)} required />
        </Form.Group>

        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <Form.Group className="mb-3" controlId="confirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </Form.Group>
        </Form.Group>
        <div className="mb-3">
          {/* Sign Up button */}
          <Button type="submit">Sign Up</Button>
        </div>
        <div className="mb-3">
          {/* Link to the Sign-In screen */}
          Already have an account?{' '}
          <Link id="allLinks" to={`/signin?redirect=${redirect}`}>Sign-In</Link>
        </div>
      </Form>
    </Container>
  );
}
