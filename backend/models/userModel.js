// Import the Mongoose library
import mongoose from 'mongoose';

// Define the schema for the "User" model using Mongoose.Schema
const userSchema = new mongoose.Schema(
  {
    // User's full name, required
    name: { type: String, required: true },

    // User's email address, must be unique and required
    email: { type: String, required: true, unique: true },

    // User's password, required
    password: { type: String, required: true },

    // Indicates whether the user has admin privileges, default is false, required
    isAdmin: { type: Boolean, default: false, required: true },
  },
  // Enable timestamps (createdAt and updatedAt) for the schema
  {
    timestamps: true,
  }
);

// Create the "User" model using the defined schema
const User = mongoose.model('User', userSchema);

// Export the "User" model
export default User;
