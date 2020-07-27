const mongoose = require('mongoose')
const Schema = mongoose.Schema

const clientSchema = new Schema({
  type: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
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
  password: {
    type: Schema.Types.Mixed
  },
  refresh_token: {
    type: String
  },
  reset_token: {
    type: String
  }
}, { versionKey: false })

module.exports = clientSchema
