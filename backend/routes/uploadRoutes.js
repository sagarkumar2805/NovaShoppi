// Import necessary dependencies
import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

// Import custom middleware for authentication and admin authorization
import { isAdmin, isAuth } from '../utils.js';

// Create an instance of the Multer middleware for file upload
const upload = multer();

// Create an instance of the Express router
const uploadRouter = express.Router();

// Route to handle file upload to Cloudinary
uploadRouter.post(
  '/',
  isAuth, // Middleware to check if the user is authenticated
  isAdmin, // Middleware to check if the user is an admin
  upload.single('file'), // Middleware to handle a single file upload
  async (req, res) => {
    // Configure Cloudinary API credentials using environment variables
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    // Function to stream upload the file to Cloudinary
    const streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        });
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    // Call the streamUpload function to upload the file and get the result
    const result = await streamUpload(req);

    // Send the Cloudinary upload result as the response
    res.send(result);
  }
);

// Export the uploadRouter
export default uploadRouter;
