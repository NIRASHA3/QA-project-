const BillModel = require("../models/billModel");

// Charge bill - creates a new bill record in the database
const chargeBill = async (req, res) => {
  try {
    const newbill = new BillModel(req.body); // Create new bill instance with request body
    await newbill.save(); // Save the new bill to database
    res.send('Bill charged successfully'); // Send success message
  } catch (error) {
    res.status(400).json(error); // Send error response if operation fails
  }
};

// Get all bills - retrieves all bills from the database
const getAllBills = async (req, res) => {
  try {
    const bills = await BillModel.find(); // Fetch all documents from bills collection
    res.send(bills); // Send bills array as response
  } catch (error) {
    res.status(400).json(error); // Send error response with status code 400
  }
};

// Export all controller functions
module.exports = {
  chargeBill,
  getAllBills
};