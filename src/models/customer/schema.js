const mongoose = require('mongoose')
const Schema = mongoose.Schema
const validator = require('validator')
const errorHandler = require('../../utils/errorHandler')

const customerSchema = new Schema({
  type: {
    type: String,
    required: true
  },
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  verified: {
    type: Boolean,
    default: false
  },
  verify_token: {
    type: String
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: value => {
      if (!validator.isEmail(value)) {
        throw errorHandler(422, 'Invalid email address')
      }
    }
  },
  password: {
    type: String,
    required: true,
    minLength: 8
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date
  }
}, { versionKey: false })

module.exports = customerSchema
