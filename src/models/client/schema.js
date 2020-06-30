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
    type: String,
    required: false
  },
  status: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  image_id: {
    type: String,
    required: false
  },
  image_url: {
    type: String,
    required: false
  },
  password: {
    type: Schema.Types.Mixed,
    default: false
  },
  refresh_token: {
    type: String,
    required: false
  },
  reset_token: {
    type: String,
    required: false
  }
}, { versionKey: false })

module.exports = clientSchema
