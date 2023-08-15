import { useEffect, useReducer } from "react";
import axios from "axios";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Product from "../components/Product";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import "./HomeScreen.css";
import { BASE_URL } from "../config";
// Reducer function for managing component state
const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, products: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function HomeScreen() {
  // Use reducer to manage component state
  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    products: [],
    loading: true,
    error: "",
  });

  // Fetch product data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      // Dispatch fetch request action
      dispatch({ type: "FETCH_REQUEST" });
      try {
        // Fetch product data from the API
        const result = await axios.get(BASE_URL + "/api/products");
        // Dispatch fetch success action with fetched data
        dispatch({ type: "FETCH_SUCCESS", payload: result.data });
      } catch (err) {
        // Dispatch fetch failure action with error message
        dispatch({ type: "FETCH_FAIL", payload: err.message });
      }
    };
    fetchData();
  }, []);

  return (
    <div className="homeScreen-container">
      <Helmet>
        <title>NovaShoppi</title>
      </Helmet>
      <div className="homeImg-container shadow">
        <img
          className="homeImg"
          src={process.env.PUBLIC_URL + "/images/homeImage.png"}
          alt="home"
        />
      </div>
      <h1>Featured Products</h1>
      <div className="products">
        {/* Display loading spinner while fetching data */}
        {loading ? (
          <LoadingBox />
        ) : error ? (
          // Display error message if fetching data fails
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          // Display product data in a grid layout
          <Row>
            {products?.map((product) => (
              <Col key={product.slug} sm={6} md={4} lg={3} className="mb-3">
                <Product product={product}></Product>
              </Col>
            ))}
          </Row>
        )}
        </div>
      </div>
    
  );
}

export default HomeScreen;
