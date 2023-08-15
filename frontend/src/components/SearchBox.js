import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import { useNavigate } from 'react-router-dom';

// Component for a search input box to search for products
export default function SearchBox() {
  // Use the useNavigate hook to navigate to search results
  const navigate = useNavigate();

  // State to store the user's search query
  const [query, setQuery] = useState('');

  // Function to handle form submission when user searches
  const submitHandler = (e) => {
    e.preventDefault();
    // Navigate to search results page with the provided query (or to a general search page if no query)
    navigate(query ? `/search/?query=${query}` : '/search');
  };

  return (
    <Form className="d-flex me-auto" onSubmit={submitHandler}>
      <InputGroup>
        {/* Input field for the search query */}
        <FormControl
          type="text"
          name="q"
          id="q"
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products..."
          aria-label="Search Products"
          aria-describedby="button-search"
        ></FormControl>
        {/* Button to trigger the search */}
        <Button variant="outline-primary" type="submit" id="button-search">
          <i className="fas fa-search"></i>
        </Button>
      </InputGroup>
    </Form>
  );
}
