import jwt from 'jsonwebtoken';

// Function to generate a JWT token based on user information
export const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET, // JWT secret key from environment variables
    {
      expiresIn: '30d', // Token expiration time (30 days)
    }
  );
};

// Middleware to check if the request contains a valid JWT token (for authentication)
export const isAuth = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    // Extract the token from the "Authorization" header
    const token = authorization.slice(7, authorization.length); // Bearer XXXXXX
    // Verify the token with the JWT secret key
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        // If the token is invalid, send a 401 response with an error message
        res.status(401).send({ message: 'Invalid Token' });
      } else {
        // If the token is valid, decode the user information and continue with the request
        req.user = decode;
        next();
      }
    });
  } else {
    // If there's no token in the request headers, send a 401 response with an error message
    res.status(401).send({ message: 'No Token' });
  }
};

// Middleware to check if the authenticated user is an admin
export const isAdmin = (req, res, next) => {
  // Check if the authenticated user is an admin based on the user object
  if (req.user && req.user.isAdmin) {
    next(); // If the user is an admin, continue with the request
  } else {
    // If the user is not an admin, send a 401 response with an error message
    res.status(401).send({ message: 'Invalid Admin Token' });
  }
};
