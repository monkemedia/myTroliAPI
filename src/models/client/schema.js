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
  role: {
    type: String,
    required: true,
    enum: ['owner', 'admin', 'supervisor', 'basic']
  },
  image_id: {
    type: String,
    required: true,
    unique: true
  },
  image_url: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
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
