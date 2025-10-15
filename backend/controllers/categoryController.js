const CategoryModel = require("../models/categoriesModel");

// Get all categories - retrieves all categories from the database
const getAllCategories = async (req, res) => {
  try {
    const categories = await CategoryModel.find(); // Fetch all documents from categories collection
    res.json(categories); // Send categories array as JSON response
  } catch (error) {
    console.error('Get categories error:', error.message); // Log error for debugging
    res.status(500).json({ error: "Internal server error" }); // Generic error message
  }
};

// Add new category - creates a new category in the database
const addCategory = async (req, res) => {
  try {
    // Input validation
    const { name, description } = req.body;
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ error: "Valid category name is required" });
    }

    const newCategory = new CategoryModel({
      name: name.trim(),
      description: description ? description.trim() : undefined
    });
    
    await newCategory.save(); // Save the new category to database
    res.status(201).json({ message: 'Category added successfully', category: newCategory }); // Send success message with created category
  } catch (error) {
    console.error('Add category error:', error.message);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update category - modifies an existing category by ID
const updateCategory = async (req, res) => {
  try {
    // Validate ID parameter
    const categoryId = req.params._id;
    if (!categoryId || categoryId.length !== 24) { // MongoDB ObjectId validation
      return res.status(400).json({ error: "Valid category ID is required" });
    }

    // Input validation for update data
    const updateData = { ...req.body };
    if (updateData.name && (typeof updateData.name !== 'string' || updateData.name.trim().length === 0)) {
      return res.status(400).json({ error: "Valid category name is required" });
    }

    // Clean update data
    if (updateData.name) updateData.name = updateData.name.trim();
    if (updateData.description) updateData.description = updateData.description.trim();

    const updatedCategory = await CategoryModel.findOneAndUpdate(
      { _id: categoryId }, // Find category by ID from URL parameter
      updateData, // Update with validated data
      { new: true, runValidators: true } // Return updated document and validate data
    );

    if (!updatedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json({ message: "Category updated successfully", category: updatedCategory }); // Send success message with updated category
  } catch (error) {
    console.error('Update category error:', error.message);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    if (error.name === 'CastError') {
      return res.status(400).json({ error: "Invalid category ID" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete category - removes a category by ID
const deleteCategory = async (req, res) => {
  try {
    // Validate ID parameter
    const categoryId = req.params._id;
    if (!categoryId || categoryId.length !== 24) { // MongoDB ObjectId validation
      return res.status(400).json({ error: "Valid category ID is required" });
    }

    const deletedCategory = await CategoryModel.findOneAndDelete({ _id: categoryId }); // Find and delete category by ID
    
    if (!deletedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json({ message: "Category deleted successfully" }); // Send success message
  } catch (error) {
    console.error('Delete category error:', error.message);
    if (error.name === 'CastError') {
      return res.status(400).json({ error: "Invalid category ID" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

// Search categories - finds categories by name or description
const searchCategories = async (req, res) => {
  try {
    const { q } = req.query; // Extract search query from URL parameters
    
    // Input validation and sanitization
    if (!q || typeof q !== 'string' || q.trim().length === 0) {
      return res.status(400).json({ error: "Valid search query is required" });
    }

    const searchQuery = q.trim();
    
    // Prevent regex injection by escaping special characters
    const escapedQuery = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // Search for categories where name or description contains the query (case-insensitive)
    const categories = await CategoryModel.find({
      $or: [
        { name: { $regex: escapedQuery, $options: 'i' } }, // Case-insensitive search on name
        { description: { $regex: escapedQuery, $options: 'i' } } // Case-insensitive search on description
      ]
    }).limit(10); // Limit results to 10 categories

    res.json(categories); // Send matching categories as JSON response
  } catch (error) {
    console.error('Search categories error:', error.message);
    res.status(500).json({ error: "Internal server error" });
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