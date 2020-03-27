const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productCategorySchema = new Schema({
  product_id: {
    type: String,
    required: true
  },
  categories: [{
    _id: false,
    type: {
      type: String,
      required: true
    },
    category_id: {
      type: String,
      required: true,
      unique: true
    }
  }]
}, { versionKey: false })

module.exports = productCategorySchema
