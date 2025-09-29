const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    unique: true 
  },
  imageURL: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  }
}, { timestamps: true });

const categoriesModel = mongoose.model("categories", categorySchema);

module.exports = categoriesModel;