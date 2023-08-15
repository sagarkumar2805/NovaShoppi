// Import the Mongoose library
import mongoose from 'mongoose';

// Define the schema for the "Order" model using Mongoose.Schema
const orderSchema = new mongoose.Schema(
  {
    // Define an array of "orderItems" which represent the individual items in the order
    orderItems: [
      {
        // Information about each item
        slug: { type: String, required: true }, // Unique identifier or slug for the item
        name: { type: String, required: true }, // Name of the item
        quantity: { type: Number, required: true }, // Quantity of the item
        image: { type: String, required: true }, // URL to the item's image
        price: { type: Number, required: true }, // Price of the item
        product: {
          type: mongoose.Schema.Types.ObjectId, // Reference to the "Product" model
          ref: 'Product', // Name of the referenced model
          required: true, // The product associated with this item is required
        },
      },
    ],
    // Define the shipping address for the order
    shippingAddress: {
      fullName: { type: String, required: true }, // Full name of the recipient
      address: { type: String, required: true }, // Shipping address
      city: { type: String, required: true }, // City
      postalCode: { type: String, required: true }, // Postal code
      country: { type: String, required: true }, // Country
    },
    // Define the payment method used for the order
    paymentMethod: { type: String, required: true },
    // Define payment result details
    paymentResult: {
      id: String,
      status: String,
      update_time: String,
      email_address: String,
    },
    // Define pricing details
    itemsPrice: { type: Number, required: true }, // Total price of all items
    shippingPrice: { type: Number, required: true }, // Shipping price
    taxPrice: { type: Number, required: true }, // Tax price
    totalPrice: { type: Number, required: true }, // Total order price
    // Define the user associated with the order
    user: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the "User" model
      ref: 'User', // Name of the referenced model
      required: true, // The user associated with this order is required
    },
    // Define flags for order status
    isPaid: { type: Boolean, default: false }, // Is the order paid?
    paidAt: { type: Date }, // Date when the order was paid
    isDelivered: { type: Boolean, default: false }, // Is the order delivered?
    deliveredAt: { type: Date }, // Date when the order was delivered
  },
  // Enable timestamps (createdAt and updatedAt) for the schema
  {
    timestamps: true,
  }
);

// Create the "Order" model using the defined schema
const Order = mongoose.model('Order', orderSchema);

// Export the "Order" model
export default Order;
