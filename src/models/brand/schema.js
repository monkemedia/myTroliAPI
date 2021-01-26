const mongoose = require('mongoose')
const Schema = mongoose.Schema

const BrandSchema = new Schema({
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
  search_keywords: {
    type: String
  },
}, { versionKey: false })

module.exports = BrandSchema
