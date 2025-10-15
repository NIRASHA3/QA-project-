const ItemModel = require("../models/itemsModel");

// Validation schema for item data
const validateItem = (data, isUpdate = false) => {
  const errors = [];
  
  if (!isUpdate && (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0)) {
    errors.push('Name is required and must be a non-empty string');
  }
  
  if (data.name && (typeof data.name !== 'string' || data.name.trim().length === 0)) {
    errors.push('Name must be a non-empty string');
  } else if (data.name && data.name.length > 100) {
    errors.push('Name must be less than 100 characters');
  }
  
  if (data.description && typeof data.description !== 'string') {
    errors.push('Description must be a string');
  } else if (data.description && data.description.length > 500) {
    errors.push('Description must be less than 500 characters');
  }
  
  if (!isUpdate && (data.price === undefined || data.price === null)) {
    errors.push('Price is required');
  }
  
  if (data.price !== undefined && data.price !== null && (typeof data.price !== 'number' || data.price < 0)) {
    errors.push('Price must be a positive number');
  }
  
  if (data.category && typeof data.category !== 'string') {
    errors.push('Category must be a string');
  } else if (data.category && data.category.length > 50) {
    errors.push('Category must be less than 50 characters');
  }
  
  if (data.stock !== undefined && data.stock !== null && (!Number.isInteger(data.stock) || data.stock < 0)) {
    errors.push('Stock must be a non-negative integer');
  }
  
  return errors;
};

// Create safe data object
const createSafeData = (body, isUpdate = false) => {
  const safeData = {};
  
  if (body.name) safeData.name = body.name.trim();
  if (body.description) safeData.description = body.description.trim();
  if (body.price !== undefined) safeData.price = body.price;
  if (body.category) safeData.category = body.category.trim();
  if (body.stock !== undefined) safeData.stock = body.stock;
  
  if (!isUpdate) {
    safeData.name = body.name.trim();
    safeData.description = body.description ? body.description.trim() : '';
    safeData.price = body.price;
    safeData.category = body.category ? body.category.trim() : '';
    safeData.stock = body.stock || 0;
  }
  
  return safeData;
};

// Get all items
const getAllItems = async (req, res) => {
  try {
    const items = await ItemModel.find();
    res.send(items);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Add new item
const addItem = async (req, res) => {
  try {
    const validationErrors = validateItem(req.body, false);
    if (validationErrors.length > 0) {
      return res.status(400).json({ errors: validationErrors });
    }
    
    const safeData = createSafeData(req.body, false);
    const newItem = new ItemModel(safeData);
    await newItem.save();
    
    res.send('Item added successfully');
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update item
const updateItem = async (req, res) => {
  try {
    const validationErrors = validateItem(req.body, true);
    if (validationErrors.length > 0) {
      return res.status(400).json({ errors: validationErrors });
    }
    
    const safeUpdate = createSafeData(req.body, true);
    if (Object.keys(safeUpdate).length === 0) {
      return res.status(400).json({ error: "No valid fields provided for update" });
    }
    
    const updatedItem = await ItemModel.findOneAndUpdate(
      { _id: req.params._id },
      safeUpdate,
      { new: true, runValidators: true }
    );
    
    if (!updatedItem) {
      return res.status(404).json({ error: "Item not found" });
    }
    
    res.send("Item updated successfully");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete item
const deleteItem = async (req, res) => {
  try {
    const deletedItem = await ItemModel.findOneAndDelete({ _id: req.params._id });
    
    if (!deletedItem) {
      return res.status(404).json({ error: "Item not found" });
    }
    
    res.send("Item deleted successfully");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Search items
const searchItems = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || typeof q !== 'string' || q.trim().length === 0) {
      return res.status(400).json({ error: "Valid search query is required" });
    }

    const sanitizedQuery = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const items = await ItemModel.find({
      $or: [
        { name: { $regex: sanitizedQuery, $options: 'i' } },
        { category: { $regex: sanitizedQuery, $options: 'i' } }
      ]
    }).limit(10);

    res.send(items);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getAllItems,
  addItem,
  updateItem,
  deleteItem,
  searchItems
};