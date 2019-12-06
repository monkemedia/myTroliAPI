const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productCategoryRelationshipSchema = new Schema({
  type: {
    type: String,
    required: true
  },
  category_id: {
    type: String,
    required: true,
    unique: true
  }
})

module.exports = productCategoryRelationshipSchema
