const mongoose = require('mongoose')
const Schema = mongoose.Schema
const validator = require('validator')
const errorHandler = require('../../utils/errorHandler')

const customerSchema = new Schema({
  type: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
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
  }
})

module.exports = customerSchema
