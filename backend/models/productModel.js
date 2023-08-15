// Import the Mongoose library
import mongoose from 'mongoose';

// Define the schema for the "Product" model using Mongoose.Schema
const productSchema = new mongoose.Schema(
  {
    // Product name, must be unique and required
    name: { type: String, required: true, unique: true },
    
    // Slug for the product, used in URLs, must be unique and required
    slug: { type: String, required: true, unique: true },
    
    // URL to the product's image, required
    image: { type: String, required: true },
    
    // Brand of the product, required
    brand: { type: String, required: true },
    
    // Category of the product, required
    category: { type: String, required: true },
    
    // Description of the product, required
    description: { type: String, required: true },
    
    // Price of the product, required
    price: { type: Number, required: true },
    
    // Number of units of the product available in stock, required
    countInStock: { type: Number, required: true },
    
    // Rating of the product, required
    rating: { type: Number, required: true },
    
    // Number of reviews for the product, required
    numReviews: { type: Number, required: true },
  },
  // Enable timestamps (createdAt and updatedAt) for the schema
  {
    timestamps: true,
  }
);

// Create the "Product" model using the defined schema
const Product = mongoose.model('Product', productSchema);

// Export the "Product" model
export default Product;
