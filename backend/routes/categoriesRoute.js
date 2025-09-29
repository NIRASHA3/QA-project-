const express = require("express");
const router = express.Router(); // Create a new router instance for category routes

// Import controller functions
const {
  getAllCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  searchCategories
} = require("../controllers/categoryController");

// Define routes and map them to controller functions

// GET /api/categories/get-all-categories - Retrieve all categories
router.get("/get-all-categories", getAllCategories);

// POST /api/categories/add-category - Create a new category
router.post("/add-category", addCategory);

// PUT /api/categories/update-category/:id - Update a category by ID
router.put("/update-category/:_id", updateCategory);

// DELETE /api/categories/delete-category/:id - Delete a category by ID
router.delete("/delete-category/:_id", deleteCategory);

// GET /api/categories/search?q=query - Search categories by name or description
router.get("/search", searchCategories);

module.exports = router; // Export the router