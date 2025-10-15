const CategoryModel = require("../models/categoriesModel");

// Enhanced validation schema for category data
const validateCategory = (data, isUpdate = false) => {
  const errors = [];
  
  // For updates, name is optional; for creates, it's required
  if (!isUpdate) {
    if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
      errors.push('Name is required and must be a non-empty string');
    }
  }
  
  // Validate name if provided
  if (data.name) {
    if (typeof data.name !== 'string' || data.name.trim().length === 0) {
      errors.push('Name must be a non-empty string');
    } else if (data.name.length > 50) {
      errors.push('Name must be less than 50 characters');
    }
  }
  
  // Validate description (optional)
  if (data.description && typeof data.description !== 'string') {
    errors.push('Description must be a string');
  } else if (data.description && data.description.length > 200) {
    errors.push('Description must be less than 200 characters');
  }
  
  // Validate status (optional)
  if (data.status && !['active', 'inactive'].includes(data.status)) {
    errors.push('Status must be either "active" or "inactive"');
  }
  
  return errors;
};

// Get all categories - retrieves all categories from the database
const getAllCategories = async (req, res) => {
  try {
    const categories = await CategoryModel.find();
    res.send(categories);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Add new category - creates a new category in the database
const addCategory = async (req, res) => {
  try {
    // Validate input data for create operation
    const validationErrors = validateCategory(req.body, false);
    if (validationErrors.length > 0) {
      return res.status(400).json({ errors: validationErrors });
    }
    
    // Create safe data object with only allowed fields
    const safeData = {
      name: req.body.name.trim(),
      description: req.body.description ? req.body.description.trim() : '',
      status: req.body.status || 'active'
    };
    
    const newCategory = new CategoryModel(safeData);
    await newCategory.save();
    res.send('Category added successfully');
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update category - modifies an existing category by ID
const updateCategory = async (req, res) => {
  try {
    // Validate input data for update operation
    const validationErrors = validateCategory(req.body, true);
    if (validationErrors.length > 0) {
      return res.status(400).json({ errors: validationErrors });
    }
    
    // Create safe update object with only allowed fields
    const safeUpdate = {};
    if (req.body.name) safeUpdate.name = req.body.name.trim();
    if (req.body.description) safeUpdate.description = req.body.description.trim();
    if (req.body.status) safeUpdate.status = req.body.status;
    
    // Check if there are any fields to update
    if (Object.keys(safeUpdate).length === 0) {
      return res.status(400).json({ error: "No valid fields provided for update" });
    }
    
    const updatedCategory = await CategoryModel.findOneAndUpdate(
      { _id: req.params._id },
      safeUpdate,
      { new: true, runValidators: true }
    );
    
    if (!updatedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }
    
    res.send("Category updated successfully");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete category - removes a category by ID
const deleteCategory = async (req, res) => {
  try {
    const deletedCategory = await CategoryModel.findOneAndDelete({ _id: req.params._id });
    
    if (!deletedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }
    
    res.send("Category deleted successfully");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Search categories - finds categories by name or description
const searchCategories = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || typeof q !== 'string' || q.trim().length === 0) {
      return res.status(400).json({ error: "Valid search query is required" });
    }

    // Sanitize search query to prevent regex injection
    const sanitizedQuery = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    const categories = await CategoryModel.find({
      $or: [
        { name: { $regex: sanitizedQuery, $options: 'i' } },
        { description: { $regex: sanitizedQuery, $options: 'i' } }
      ]
    }).limit(10);

    res.send(categories);
  } catch (error) {
    res.status(400).json({ error: error.message });
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