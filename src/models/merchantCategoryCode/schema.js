const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MerchantCategoryCodeSchema = new Schema({
  mcc: {
    type: String,
    required: true
  },
  edited_description: {
    type: String,
    required: true
  },
  combined_description: {
    type: String
  },
  usda_description: {
    type: String
  },
  irs_description: {
    type: String
  },
  irs_reportable: {
    type: String
  },
  id: {
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
