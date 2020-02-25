const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productCategorySchema = new Schema({
  type: {
    type: String,
    required: true
  },

  name: {
    type: Schema.Types.ObjectId,
    ref: 'Category'
  },

  product_id: {
    type: String,
    required: true,
    unique: true
  }
}, { versionKey: false })

module.exports = productCategorySchema
