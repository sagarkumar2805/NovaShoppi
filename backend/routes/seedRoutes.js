// Import necessary dependencies and models
import express from 'express';
import Product from '../models/productModel.js';
import data from '../data.js';
import User from '../models/userModel.js';

// Create an instance of the Express router
const seedRouter = express.Router();

// Route to seed the database with sample products and users
seedRouter.get('/', async (req, res) => {
  // Clear the existing products in the database using deleteMany
  await Product.deleteMany({});
  // Insert the sample products from the data.js file into the database
  const createdProducts = await Product.insertMany(data.products);

  // Clear the existing users in the database using deleteMany
  await User.deleteMany({});
  // Insert the sample users from the data.js file into the database
  const createdUsers = await User.insertMany(data.users);

  // Send a response indicating the number of created products and users
  res.send({ createdProducts, createdUsers });
});

// Export the seedRouter
export default seedRouter;

