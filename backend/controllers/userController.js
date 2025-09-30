const UserModel = require("../models/userModel");

// Login - authenticates user credentials
const login = async (req, res) => {
  try {
    /*
     //GREEN TEST
    //NEW VALIDATION: Check password length first
    if (!req.body.password || req.body.password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters long" });
    }*/
   

    // Find user with matching userId, password, and verified status
    const user = await UserModel.findOne({
      userId: req.body.userId, // User ID from request body
      password: req.body.password, // Password from request body
      verified: true, // Only allow verified users to login
      
    });
    
    
    if (user) {
      res.send(user); // Send user data if authentication succeeds
    } else {
      // Send error response if authentication fails
      res.status(400).json({ message: "Login failed", user });
    }
  } catch (error) {
    res.status(400).json(error); // Send error response if operation fails
  }
};

// Register - creates a new user account
const register = async (req, res) => {
  try {
    // Create new user with data from request body and set verified to false initially
    const newuser = new UserModel({ ...req.body, verified: false });
    await newuser.save(); // Save the new user to database
    res.send("User Registered successfully"); // Send success message
  } catch (error) {
    res.status(400).json(error); // Send error response if operation fails
  }
};

// Export all controller functions
module.exports = {
  login,
  register
};