const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const errorHandler = require('../utils/errorHandler')

const customerSchema = mongoose.Schema({
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

// Hash the password before saving the customer model
customerSchema.pre('save', async function (next) {
  const customer = this

  if (customer.isModified('password')) {
    customer.password = await bcrypt.hash(customer.password, 8)
  }
  next()
})

// Genrate an auth token for customer
customerSchema.methods.generateAccessToken = async function () {
  const customer = this
  const accessToken = jwt.sign({
    _id: customer.client_id
  }, process.env.CLIENT_SECRET, { expiresIn: '1h' })

  return accessToken
}

// Search for a customer by email address
customerSchema.statics.getAll = async (email) => {
  const customers = await Customer.find({})

  return customers
}

// Search for a customer by email address
customerSchema.statics.findByEmail = async (email) => {
  const customer = await Customer.findOne({ email })

  return customer
}

// Search for a customer by email and password
customerSchema.statics.findByCredentials = async (email, password) => {
  const customer = await Customer.findOne({ email })

  if (!customer) {
    throw errorHandler(422, 'Customer does\'t exists')
  }

  const isPasswordMatch = await bcrypt.compare(password, customer.password)

  if (!isPasswordMatch) {
    throw errorHandler(422, 'Invalid login credentials')
  }

  return customer
}

// Update customer
customerSchema.statics.updateCustomer = async (customerDetails) => {
  const { _id, name, email, password } = customerDetails
  const customer = await Customer.updateOne({ _id }, { name, email, password })
  return customer
}

// Delete customer by id
customerSchema.statics.deleteCustomer = async (_id) => {
  const customer = await Customer.deleteOne({ _id })
  return customer
}

const Customer = mongoose.model('Customer', customerSchema)

module.exports = Customer
