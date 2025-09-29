const express = require("express");
const router = express.Router(); // Create a new router instance for bill routes

// Import controller functions
const {
  chargeBill,
  getAllBills
} = require("../controllers/billController");

// Define routes and map them to controller functions

// POST /api/bills/charge-bill - Create a new bill
router.post("/charge-bill", chargeBill);

// GET /api/bills/get-all-bills - Retrieve all bills
router.get("/get-all-bills", getAllBills);

module.exports = router; // Export the router