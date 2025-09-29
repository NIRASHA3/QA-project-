const ItemModel = require("../models/itemsModel");

// Get all items - retrieves all items from the database
const getAllItems = async (req, res) => {
  try {
    const items = await ItemModel.find(); // Fetch all documents from items collection
    res.send(items); // Send items array as response
  } catch (error) {
    res.status(400).json(error); // Send error response with status code 400
  }
};

// Add new item - creates a new item in the database
const addItem = async (req, res) => {
  try {
    const newitem = new ItemModel(req.body); // Create new item instance with request body
    await newitem.save(); // Save the new item to database
    res.send('Item added successfully'); // Send success message
  } catch (error) {
    res.status(400).json(error); // Send error response if operation fails
  }
};

// Update item - modifies an existing item by ID
const updateItem = async (req, res) => {
  try {
    await ItemModel.findOneAndUpdate(
      { _id: req.params._id }, // Find item by ID from URL parameter
      req.body, // Update with data from request body
      { new: true, runValidators: true } // Return updated document and validate data
    );
    res.send("Item updated successfully"); // Send success message
  } catch (error) {
    res.status(400).json({ error: error.message }); // Send error response with message
  }
};

// Delete item - removes an item by ID
const deleteItem = async (req, res) => {
  try {
    await ItemModel.findOneAndDelete({ _id: req.params._id }); // Find and delete item by ID
    res.send("Item deleted successfully"); // Send success message
  } catch (error) {
    res.status(400).json({ error: error.message }); // Send error response with message
  }
};

// Search items - finds items by name or category
const searchItems = async (req, res) => {
  try {
    const { q } = req.query; // Extract search query from URL parameters
    if (!q) {
      return res.status(400).json({ error: "Search query is required" }); // Validate query exists
    }

    // Search for items where name or category contains the query (case-insensitive)
    const items = await ItemModel.find({
      $or: [
        { name: { $regex: q, $options: 'i' } }, // Case-insensitive search on name
        { category: { $regex: q, $options: 'i' } } // Case-insensitive search on category
      ]
    }).limit(10); // Limit results to 10 items

    res.send(items); // Send matching items as response
  } catch (error) {
    res.status(400).json(error); // Send error response if search fails
  }
};

// Export all controller functions
module.exports = {
  getAllItems,
  addItem,
  updateItem,
  deleteItem,
  searchItems
};