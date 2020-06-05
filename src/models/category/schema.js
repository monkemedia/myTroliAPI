const mongoose = require('mongoose')
const Schema = mongoose.Schema

const categorySchema = new Schema({
  type: {
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
    type: String,
    required: false
  },
  parent_id: {
    type: String,
    default: null
  },
  status: {
    type: Object,
    required: false
  }
}, { versionKey: false })

module.exports = categorySchema
