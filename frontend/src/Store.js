import { createContext, useReducer } from 'react';

// Create a context for the global store
export const Store = createContext();

// Initial state for the store
const initialState = {
  // Initialize user info from local storage or set to null
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,

  // Initialize cart state with shipping address, payment method, and cart items from local storage or set to empty values
  cart: {
    shippingAddress: localStorage.getItem('shippingAddress')
      ? JSON.parse(localStorage.getItem('shippingAddress'))
      : {},
    paymentMethod: localStorage.getItem('paymentMethod')
      ? localStorage.getItem('paymentMethod')
      : '',
    cartItems: localStorage.getItem('cartItems')
      ? JSON.parse(localStorage.getItem('cartItems'))
      : [],
  },
};

// Reducer function to handle state changes
function reducer(state, action) {
  switch (action.type) {
    case 'CART_ADD_ITEM':
      // Add or update an item in the cart
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find(
        (item) => item._id === newItem._id
      );
      const cartItems = existItem
        ? state.cart.cartItems?.map((item) =>
            item._id === existItem._id ? newItem : item
          )
        : [...state.cart.cartItems, newItem];
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };

    case 'CART_REMOVE_ITEM': {
      // Remove an item from the cart
      const cartItems = state.cart.cartItems.filter(
        (item) => item._id !== action.payload._id
      );
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    }

    case 'CART_CLEAR':
      // Clear all items from the cart
      return { ...state, cart: { ...state.cart, cartItems: [] } };

    case 'USER_SIGNIN':
      // Set user info when signing in
      return { ...state, userInfo: action.payload };

    case 'USER_SIGNOUT':
      // Clear user info and cart on signout
      return {
        ...state,
        userInfo: null,
        cart: {
          cartItems: [],
          shippingAddress: {},
          paymentMethod: '',
        },
      };

    case 'SAVE_SHIPPING_ADDRESS':
      // Save the shipping address to the cart
      return {
        ...state,
        cart: {
          ...state.cart,
          shippingAddress: action.payload,
        },
      };

    case 'SAVE_PAYMENT_METHOD':
      // Save the payment method to the cart
      return {
        ...state,
        cart: { ...state.cart, paymentMethod: action.payload },
      };

    default:
      // Return the current state for any other action
      return state;
  }
}

// StoreProvider component to provide the store context to the entire app
export function StoreProvider(props) {
  // Initialize the store state and dispatch function using the reducer and initial state
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  
  // Provide the store value to the children components
  return <Store.Provider value={value}>{props.children} </Store.Provider>;
}
