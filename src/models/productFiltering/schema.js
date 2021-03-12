const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProductFilterSchema = new Schema({
  store_hash: {
    type: String,
    required: true
  },
  facets: [{
    name: {
      type: String
    },
    slug: {
      type: String
    },
    sort_order: {
      type: Number
    },
    visible: {
      type: Boolean
    }
  }],
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date
  }
  
}, { versionKey: false })

module.exports = ProductFilterSchema
