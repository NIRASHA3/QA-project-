const CategoryModel = require("../models/categoriesModel");
const mongoose = require('mongoose');
const escapeStringRegexp = require('escape-string-regexp');

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
    // Whitelist allowed fields to prevent users from injecting unexpected properties
    const allowed = ['name', 'description', 'image'];
    const payload = {};
    for (const key of allowed) {
      if (Object.prototype.hasOwnProperty.call(req.body, key)) {
        payload[key] = req.body[key];
      }
    }

    const newCategory = new CategoryModel(payload);
    await newCategory.save();
    res.send('Category added successfully');
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update category - modifies an existing category by ID
const updateCategory = async (req, res) => {
  try {
    const { _id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).json({ error: 'Invalid category id' });
    }

    // Whitelist allowed update fields
    const allowed = ['name', 'description', 'image'];
    const updates = {};
    for (const key of allowed) {
      if (Object.prototype.hasOwnProperty.call(req.body, key)) {
        updates[key] = req.body[key];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    await CategoryModel.findOneAndUpdate(
      { _id },
      updates,
      { new: true, runValidators: true }
    );

    res.send('Category updated successfully');
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete category - removes a category by ID
const deleteCategory = async (req, res) => {
  try {
    const { _id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).json({ error: 'Invalid category id' });
    }

    await CategoryModel.findOneAndDelete({ _id });
    res.send('Category deleted successfully');
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Search categories - finds categories by name or description
const searchCategories = async (req, res) => {
  try {
    const { q } = req.query; // Extract search query from URL parameters
    if (!q) {
      return res.status(400).json({ error: "Search query is required" }); // Validate query exists
    }

    // Escape the user input before using in regex to avoid regex injection
    const safeQ = escapeStringRegexp(q);

    // Search for categories where name or description contains the query (case-insensitive)
    const categories = await CategoryModel.find({
      $or: [
        { name: { $regex: safeQ, $options: 'i' } }, // Case-insensitive search on name
        { description: { $regex: safeQ, $options: 'i' } } // Case-insensitive search on description
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