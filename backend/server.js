const app = require('./app'); // Import the app from app.js (SAME directory)
const dbConnect = require("./dbConnect"); // handles connection to MongoDB

// Use environment variable PORT if available, otherwise default to 5000
const port = process.env.PORT || 5000;



// Start the server and listen on the specified port
app.listen(port, () => console.log(`Node JS Server Running at port ${port}`));