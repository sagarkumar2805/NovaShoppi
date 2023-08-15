// Import necessary dependencies and modules
import express from 'express';
import data from './data.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import seedRouter from './routes/seedRoutes.js';
import productRouter from './routes/productRoutes.js';
import userRouter from './routes/userRoutes.js';
import orderRouter from './routes/orderRoutes.js';
import uploadRouter from './routes/uploadRoutes.js';
import cors from 'cors';

// Load environment variables from .env file
dotenv.config();

// Connect to the MongoDB database
mongoose
  .connect(process.env.MONGODB_URI) // Use the MongoDB URI from environment variables
  .then(() => {
    console.log('connected to db');
  })
  .catch((err) => {
    console.log(err.message);
  });

// Create an instance of the Express application
const app = express();

// Enable Cross-Origin Resource Sharing (CORS) for the app
app.use(cors());

// Configure the app to parse JSON and URL-encoded data in the request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route to provide PayPal client ID
app.get('/api/keys/paypal', (req, res) => {
  // Send the PayPal client ID from environment variables (or a sandbox value)
  res.send(process.env.PAYPAL_CLIENT_ID || 'sb');
});

// Use the specified routers for various API endpoints
app.use('/api/upload', uploadRouter);
app.use('/api/seed', seedRouter);
app.use('/api/products', productRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);

// Error handling middleware: Handle server errors and send an error response
app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

// Start the Express app on the specified port
const port = process.env.PORT || 5000; // Use the specified port from environment variables or default to 5000
app.listen(port, () => {
  console.log(`serve at http://localhost:${port}`);
});
