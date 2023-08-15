import { Link } from 'react-router-dom';
import Rating from './Rating';
import axios from 'axios';
import { useContext } from 'react';
import { Store } from '../Store';

// Component to display individual product details
function Product(props) {
  // Destructure the product from props
  const { product } = props;

  // Extract cart items from the global state using context
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  // Function to handle adding a product to the cart
  const addToCartHandler = async (item) => {
    // Check if the product already exists in the cart
    const existItem = cartItems.find((x) => x._id === product._id);
    // Determine the quantity to add (increase quantity if the item is already in the cart)
    const quantity = existItem ? existItem.quantity + 1 : 1;
    // Fetch product data from the server
    const { data } = await axios.get(`/api/products/${item._id}`);
    // Check if the product is in stock
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    // Dispatch an action to add the item to the cart
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    });
  };

  return (
    <div className='shadow p-3 mb-4 bg-body rounded'>
      {/* Link to the product details page */}
      <Link to={`/product/${product.slug}`}>
        <img src={product.image} className='img-fluid' alt={product.name} />
      </Link>
      <div className='product-card'>
        {/* Link to the product details page */}
        <Link to={`/product/${product.slug}`}>
          <h4 className='product-name'>{product.name}</h4>
        </Link>
        {/* Display product rating and reviews */}
        <Rating rating={product.rating} numReviews={product.numReviews} />
        {/* Display product price */}
        <p>${product.price}</p>
        {/* Display "Out of stock" message or "Add to cart" button */}
        {product.countInStock === 0 ? (
          <div className='btn btn-light' disabled>
            Out of stock
          </div>
        ) : (
          <button
            className='btn btn-primary'
            onClick={() => addToCartHandler(product)}
          >
            Add to cart
          </button>
        )}
      </div>
    </div>
  );
}

export default Product;
