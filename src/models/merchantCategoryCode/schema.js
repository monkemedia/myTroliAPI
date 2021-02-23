const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MerchantCategoryCodeSchema = new Schema({
  code: {
    type: String,
    required: true
  },
  category: {
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

module.exports = MerchantCategoryCodeSchema
