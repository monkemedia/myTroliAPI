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
