const express = require("express");
const cors = require("cors");
const path = require('path');

// Import route handlers for different API endpoints
const itemsRoute = require("./routes/itemsRoute");
const usersRoute = require("./routes/userRoute");
const billsRoute = require('./routes/billsRoute');
const categoriesRoute = require('./routes/categoriesRoute');

const app = express(); // Create an Express application instance

// Middleware
app.use(cors()); // allows requests from different origins
app.use(express.json()); // automatically parses JSON request bodies

// Mount the route handlers to specific URL paths
app.use("/api/items/", itemsRoute);
app.use("/api/users/", usersRoute);
app.use("/api/bills/", billsRoute);
app.use('/api/categories', categoriesRoute);



// Production setup for serving React app
if(process.env.NODE_ENV === 'production') {
    app.use('/', express.static('client/build'));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client/build/index.html'));
    });
}

// Define a simple root route for testing
app.get("/", (req, res) => res.send("Hello World! from home api"));

// Export the Express app for use in server.js and tests
module.exports = app;