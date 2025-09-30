const express = require("express");
const router = express.Router(); 

// Import controller functions
const {
  login,
  register
} = require("../controllers/userController");

 // Import the middleware
const { validateLoginInput } = require('../middleware/validation');
//Make it work by commenting out the middleware for now
router.post('/login', validateLoginInput, login);
//router.post('/register', register);


// Define routes and map them to controller functions

// POST /api/users/login - Authenticate user
router.post("/login", login);


// POST /api/users/register - Create a new user
router.post("/register", register);

module.exports = router; 