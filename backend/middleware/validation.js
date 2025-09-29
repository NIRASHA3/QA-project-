  /*const validateLoginInput = (req, res, next) => {
  const { password } = req.body;

  // Check if password exists
  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  // Check password length
  if (password.length < 8) {
    return res.status(400).json({ message: "Password must be at least 8 characters long" });
  }

  // If validation passes, move to the next middleware/controller
  next();
};

module.exports = { validateLoginInput };*/

// middleware/validation.js (Enhanced validaton rules to check userID format)
  const validateLoginInput = (req, res, next) => {
  const { userId, password } = req.body;

  // Check if fields are missing (undefined or null)
  if (userId === undefined || password === undefined) {
    return res.status(400).json({ message: "User ID and password are required" });
  }

  // Check if fields are empty strings
  if (userId.trim().length === 0 && password.trim().length === 0) {
    return res.status(400).json({ message: "User ID and password are required" });
  }
  
  if (userId.trim().length === 0) {
    return res.status(400).json({ message: "User ID cannot be empty" });
  }

  if (password.trim().length === 0) {
    return res.status(400).json({ message: "Password is required" }); 
  }

  // Check password length
  if (password.length < 8) {
    return res.status(400).json({ message: "Password must be at least 8 characters long" });
  }

  next();
};

module.exports = { validateLoginInput };