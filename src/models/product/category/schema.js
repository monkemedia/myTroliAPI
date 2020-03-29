const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productCategorySchema = new Schema({
  product_id: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  categories: {
    type: Array,
    unique: true
  }
}, { versionKey: false })

module.exports = productCategorySchema
