const mongoose = require('mongoose')
const Schema = mongoose.Schema

const promotionSchema = Schema({
  type: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  promotion_type: {
    type: String,
    required: true
  },
  enabled: {
    type: String,
    required: true
  },
  start: {
    type: String,
    required: true
  },
  end: {
    type: String,
    required: true
  },
  percentage: {
    type: Number,
    required: false
  }
}, { versionKey: false })

module.exports = promotionSchema
