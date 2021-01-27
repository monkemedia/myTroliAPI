const mongoose = require('mongoose')
const Schema = mongoose.Schema

const OrderStatusSchema = new Schema({
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
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date
  }
}, { versionKey: false })

module.exports = OrderStatusSchema
