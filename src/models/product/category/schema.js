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
  categories: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Category'
    }
  ]
}, { versionKey: false })

module.exports = productCategorySchema
