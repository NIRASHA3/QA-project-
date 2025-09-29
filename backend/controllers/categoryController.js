const CategoryModel = require("../models/categoriesModel");

// Get all categories - retrieves all categories from the database
const getAllCategories = async (req, res) => {
  try {
    const categories = await CategoryModel.find(); // Fetch all documents from categories collection
    res.send(categories); // Send categories array as response
  } catch (error) {
    res.status(400).json(error); // Send error response with status code 400
  }
};

// Add new category - creates a new category in the database
const addCategory = async (req, res) => {
  try {
    const newCategory = new CategoryModel(req.body); // Create new category instance with request body
    await newCategory.save(); // Save the new category to database
    res.send('Category added successfully'); // Send success message
  } catch (error) {
    res.status(400).json(error); // Send error response if operation fails
  }
};

// Update category - modifies an existing category by ID
const updateCategory = async (req, res) => {
  try {
    await CategoryModel.findOneAndUpdate(
      { _id: req.params._id }, // Find category by ID from URL parameter
      req.body, // Update with data from request body
      { new: true, runValidators: true } // Return updated document and validate data
    );
    res.send("Category updated successfully"); // Send success message
  } catch (error) {
    res.status(400).json({ error: error.message }); // Send error response with message
  }
};

// Delete category - removes a category by ID
const deleteCategory = async (req, res) => {
  try {
    await CategoryModel.findOneAndDelete({ _id: req.params._id }); // Find and delete category by ID
    res.send("Category deleted successfully"); // Send success message
  } catch (error) {
    res.status(400).json({ error: error.message }); // Send error response with message
  }
};

// Search categories - finds categories by name or description
const searchCategories = async (req, res) => {
  try {
    const { q } = req.query; // Extract search query from URL parameters
    if (!q) {
      return res.status(400).json({ error: "Search query is required" }); // Validate query exists
    }

    // Search for categories where name or description contains the query (case-insensitive)
    const categories = await CategoryModel.find({
      $or: [
        { name: { $regex: q, $options: 'i' } }, // Case-insensitive search on name
        { description: { $regex: q, $options: 'i' } } // Case-insensitive search on description
      ]
    }).limit(10); // Limit results to 10 categories

    res.send(categories); // Send matching categories as response
  } catch (error) {
    res.status(400).json(error); // Send error response if search fails
  }
};

// Export all controller functions
module.exports = {
  getAllCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  searchCategories
};