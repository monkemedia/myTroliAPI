const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productFieldSchema = new Schema({
  type: {
    type: String,
    required: true
  },
  title: {
    type: String
  },
  text: {
    type: String
  },
  status: {
    type: String,
    enum: ['approved', 'disapproved', 'pending']
  },
  rating: {
    type: Number,
    enum: [0, 1, 2, 3, 4, 5]
  },
  email: {
    type: String
  },
  name: {
    type: String
  },
  product_id: {
    type: String
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date
  }
}, { versionKey: false })

module.exports = productFieldSchema
