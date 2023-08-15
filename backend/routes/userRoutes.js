// Import necessary dependencies and models
import express from "express";
import bcrypt from "bcryptjs";
import expressAsyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import { generateToken, isAuth, isAdmin } from "../utils.js";

// Create an instance of the Express router
const userRouter = express.Router();

// Route to get all users (Admin-only)
userRouter.get(
  '/',
  isAuth, // Middleware to check if the user is authenticated
  isAdmin, // Middleware to check if the user is an admin
  expressAsyncHandler(async (req, res) => {
    // Find all users in the database
    const users = await User.find({});
    res.send(users);
  })
);

// Route to get user by ID (Admin-only)
userRouter.get(
  '/:id',
  isAuth, // Middleware to check if the user is authenticated
  isAdmin, // Middleware to check if the user is an admin
  expressAsyncHandler(async (req, res) => {
    // Find a user by ID
    const user = await User.findById(req.params.id);
    if (user) {
      res.send(user);
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  })
);

// Route to update user by ID (Admin-only)
userRouter.put(
  '/:id',
  isAuth, // Middleware to check if the user is authenticated
  isAdmin, // Middleware to check if the user is an admin
  expressAsyncHandler(async (req, res) => {
    // Find a user by ID
    const user = await User.findById(req.params.id);
    if (user) {
      // Update user properties based on the request body
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.isAdmin = Boolean(req.body.isAdmin);
      // Save the updated user
      const updatedUser = await user.save();
      res.send({ message: 'User Updated', user: updatedUser });
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  })
);

// Route to delete user by ID (Admin-only)
userRouter.delete(
  '/:id',
  isAuth, // Middleware to check if the user is authenticated
  isAdmin, // Middleware to check if the user is an admin
  expressAsyncHandler(async (req, res) => {
    const userId = req.params.id;
    // Find a user by ID
    const user = await User.findById(userId);
    if (user) {
      // Check if the user to be deleted is the admin
      if (user.email === 'admin@example.com') {
        res.status(400).send({ message: 'Can Not Delete Admin User' });
        return;
      }
      // Use deleteOne() to remove the user
      await User.deleteOne({ _id: userId });
      res.send({ message: 'User Deleted' });
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  })
);

// Route for user signin
userRouter.post(
  "/signin",
  expressAsyncHandler(async (req, res) => {
    // Find a user by email
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      // Compare the provided password with the stored hash
      if (bcrypt.compareSync(req.body.password, user.password)) {
        // If the password is valid, generate a token and send user info
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user),
        });
        return;
      }
    }
    // Invalid email or password
    res.status(401).send({ message: "Invalid email or password" });
  })
);

// Route for user signup
userRouter.post(
  "/signup",
  expressAsyncHandler(async (req, res) => {
    // Create a new user with hashed password
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password),
    });
    // Save the new user
    const user = await newUser.save();
    // Generate a token and send user info
    res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user),
    });
  })
);

// Route to update user profile (Authenticated)
userRouter.put(
  '/profile',
  isAuth, // Middleware to check if the user is authenticated
  expressAsyncHandler(async (req, res) => {
    // Find the authenticated user by user ID
    const user = await User.findById(req.user._id);
    if (user) {
      // Update user properties based on the request body
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      // Update password if provided in the request body
      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, 8);
      }
      // Save the updated user
      const updatedUser = await user.save();
      // Generate a new token and send updated user info
      res.send({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser),
      });
    } else {
      res.status(404).send({ message: 'User not found' });
    }
  })
);

// Export the userRouter
export default userRouter;
