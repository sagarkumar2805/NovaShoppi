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

export default function SigninScreen() {
  // Get navigation function and redirect URL from location
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';

  // Local state for form input values
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Get user info from global state and dispatch function
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  // Handler for form submission
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      // Send signin request to the API
      const { data } = await Axios.post(BASE_URL+'/api/users/signin', {
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
      // Handle signin error
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
        <title>Sign In</title>
      </Helmet>
      <h1 className="my-3">Sign In</h1>
      <Form onSubmit={submitHandler}>
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
        </Form.Group>
        <div className="mb-3">
          {/* Sign In button */}
          <Button type="submit">Sign In</Button>
        </div>
        <div className="mb-3">
          {/* Link to the Signup screen */}
          New customer?{' '}
          <Link id="allLinks" to={`/signup?redirect=${redirect}`}>Create your account</Link>
        </div>
      </Form>
    </Container>
  );
}
