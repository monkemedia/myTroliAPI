const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CategorySchema = new Schema({
  type: {
    type: String,
    required: true
  },
  store_hash: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String
  },
  parent_id: {
    type: String
  },
  status: {
    type: Object
  }
}, { versionKey: false })

module.exports = CategorySchema
