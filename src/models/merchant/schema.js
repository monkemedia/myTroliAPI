const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MerchantSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String
  },
  store_hash: {
    type: String,
    required: true,
  },
  name: {
    type: String
  },
  enabled: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    required: true
  },
  image_id: {
    type: String
  },
  image_url: {
    type: String
  },
  refresh_token: {
    type: String
  },
  reset_token: {
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

module.exports = MerchantSchema
