import React, { useContext, useEffect, useReducer } from 'react';
import Chart from 'react-google-charts';
import axios from 'axios';
import { Store } from '../Store';
import { getError } from '../utils';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { BASE_URL } from "../config";

// Reducer function for managing component state
const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        summary: action.payload,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function DashboardScreen() {
  // Use reducer to manage component state
  const [{ loading, summary, error }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  // Access user info from the global store context
  const { state } = useContext(Store);
  const { userInfo } = state;

  // Fetch summary data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(BASE_URL+'/api/orders/summary', {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        // Dispatch success action with fetched data
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        // Dispatch failure action with error message
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [userInfo]);

  return (
    <div>
      <h1>Dashboard</h1>
      {/* Display loading spinner while fetching data */}
      {loading ? (
        <LoadingBox />
      ) : error ? (
        // Display error message if fetching data fails
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        // Display dashboard summary data if fetched successfully
        <>
          <Row>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>
                    {/* Display number of users */}
                    {summary.users && summary.users[0]
                      ? summary.users[0].numUsers
                      : 0}
                  </Card.Title>
                  <Card.Text>Users</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>
                    {/* Display number of orders */}
                    {summary.orders && summary?.users[0]
                      ? summary.orders[0]?.numOrders
                      : 0}
                  </Card.Title>
                  <Card.Text>Orders</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>
                    {/* Display total sales */}
                    ${summary.orders && summary.users[0]
                      ? summary.orders[0]?.totalSales.toFixed(2)
                      : 0}
                  </Card.Title>
                  <Card.Text>Orders</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          {/* Display daily sales chart */}
          <div className="my-3">
            <h2>Sales</h2>
            {summary.dailyOrders.length === 0 ? (
              // Display message if there are no sales data
              <MessageBox>No Sale</MessageBox>
            ) : (
              // Display sales data in an area chart
              <Chart
                width="100%"
                height="400px"
                chartType="AreaChart"
                loader={<div>Loading Chart...</div>}
                data={[
                  ['Date', 'Sales'],
                  ...summary.dailyOrders?.map((x) => [x._id, x.sales]),
                ]}
              ></Chart>
            )}
          </div>
          {/* Display product categories chart */}
          <div className="my-3">
            <h2>Categories</h2>
            {summary.productCategories.length === 0 ? (
              // Display message if there are no product categories
              <MessageBox>No Category</MessageBox>
            ) : (
              // Display product categories data in a pie chart
              <Chart
                width="100%"
                height="400px"
                chartType="PieChart"
                loader={<div>Loading Chart...</div>}
                data={[
                  ['Category', 'Products'],
                  ...summary.productCategories?.map((x) => [x._id, x.count]),
                ]}
              ></Chart>
            )}
          </div>
        </>
      )}
    </div>
  );
}
