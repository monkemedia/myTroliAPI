const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const errorHandler = require('../../utils/errorHandler')
const customerSchema = require('./schema.js')

// Hash the password before saving the customer model
customerSchema.pre('save', async function (next) {
  const customer = this

  if (customer.isModified('password')) {
    customer.password = await bcrypt.hash(customer.password, 8)
  }
  next()
})

// Generate customer verify token
customerSchema.methods.generateVerifyToken = async function (expiresIn) {
  const customer = this
  const verifyToken = jwt.sign({
    email: customer.email
  }, process.env.VERIFY_SECRET, { expiresIn: expiresIn || '24hrs' })

  return verifyToken
}

// Generate an auth token for customer
customerSchema.methods.generateAccessToken = async function () {
  const customer = this
  const accessToken = jwt.sign({
    _id: customer.client_id
  }, process.env.CLIENT_SECRET, { expiresIn: '1h' })

  return accessToken
}

// Get customers
customerSchema.statics.findCustomers = async ({ page, limit }) => {
  const customers = await Customer
    .find({})
    .skip((page - 1) * limit)
    .limit(limit)
    .select('-password')

  const total = await Customer.countDocuments()
  return {
    data: customers,
    meta: {
      pagination: {
        current: page,
        total: customers.length
      },
      results: {
        total
      }
    }
  }
}

// Search customers by name or email address
customerSchema.statics.search = async ({ keyword, page, limit }) => {
  const searchString = new RegExp(decodeURIComponent(keyword), 'i')
  const searchQuery = {
    fullname: { $concat: ['$first_name', ' ', '$last_name'] },
    first_name: 1,
    last_name: 1,
    email: 1
  }
  const searchArray = { $or: [{ fullname: searchString }, { email: searchString }] }
  const customers = await Customer
    .aggregate()
    .project(searchQuery)
    .match(searchArray)
    .skip((page - 1) * limit)
    .limit(limit)

  const total = await Customer.countDocuments(searchArray)
  return {
    data: customers,
    meta: {
      pagination: {
        current: page,
        total: customers.length
      },
      results: {
        total: total
      }
    }
  }
}

// Find customer by email address
customerSchema.statics.findByEmail = async (email) => {
  const customer = await Customer.findOne({ email }).select('-password')

  return customer
}

// Find customer by verify token
customerSchema.statics.verifyToken = async (verify_token) => {
  const customer = await Customer.updateOne({ verify_token }, {
    verified: true,
    verify_token: null
  }).select('-password')
  return customer
}

// Find customer by email and password
customerSchema.statics.findByCredentials = async (email, password) => {
  const customer = await Customer.findOne({ email }).select('-password')

  if (!customer) {
    throw errorHandler(422, 'Customer does not exists')
  }

  const isPasswordMatch = await bcrypt.compare(password, customer.password)

  if (!isPasswordMatch) {
    throw errorHandler(422, 'Invalid login credentials')
  }

  return customer
}

// Get customers count
customerSchema.statics.getCount = async () => {
  const total = await Customer.countDocuments()
  return {
    count: total
  }
}

// Update customer
customerSchema.statics.updateCustomer = async (customerId, customerDetails) => {
  let { password } = customerDetails
  const savedPassword = await Customer.findOne({ _id: customerId }).select('password')

  if (!password) {
    password = savedPassword.password
  } else {
    password = await bcrypt.hash(password, 8)
  }

  const customer = await Customer.updateOne({ _id: customerId }, { ...customerDetails, password })
  return customer
}

// Delete customer by id
customerSchema.statics.deleteCustomer = async (_id) => {
  const customer = await Customer.deleteOne({ _id })
  return customer
}

const Customer = mongoose.model('Customer', customerSchema)

module.exports = Customer
