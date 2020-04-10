const mongoose = require('mongoose')
const Schema = mongoose.Schema

const orderStatusSchema = new Schema({
  type: {
    type: String,
    required: true
  },
  status_id: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  }
}, { versionKey: false })

module.exports = orderStatusSchema
