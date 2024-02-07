const mongoose = require('mongoose');

const { Schema } = mongoose;

//category schema
const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  }
});

//create category model using categorySchema
const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
