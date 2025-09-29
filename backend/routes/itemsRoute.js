const express = require("express");
const router = express.Router(); // Create a new router instance for item routes

// Import controller functions
const {
  getAllItems,
  addItem,
  updateItem,
  deleteItem,
  searchItems
} = require("../controllers/itemController");

// Define routes and map them to controller functions

// GET /api/items/get-all-items - Retrieve all items
router.get("/get-all-items", getAllItems);

// POST /api/items/add-item - Create a new item
router.post("/add-item", addItem);

// PUT /api/items/:id - Update an item by ID
router.put("/:_id", updateItem);

// DELETE /api/items/:id - Delete an item by ID
router.delete("/:_id", deleteItem);

// GET /api/items/search?q=query - Search items by name or category
router.get("/search", searchItems);

module.exports = router; // Export the router