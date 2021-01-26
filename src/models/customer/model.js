const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cls = require('cls-hooked')
const session = cls.getNamespace('session')
const errorHandler = require('../../utils/errorHandler')
const CustomerSchema = require('./schema.js')
const CustomerAddress = require('./address')
const CustomerCoupon = require('./coupon')

// Hash the password before saving the customer model
// Delete store credit if it exists
CustomerSchema.pre('save', async function (next) {
  const customer = this

  if (customer.isModified('password')) {
    customer.password = await bcrypt.hash(customer.password, 8)
  }
  next()
})

// Generate customer verify token
CustomerSchema.methods.generateVerifyToken = async function (expiresIn) {
  const customer = this
  const storeHash = session.get('store_hash')
  const verifyToken = jwt.sign({
    email: customer.email,
    store_hash: storeHash,
  }, process.env.VERIFY_SECRET, { expiresIn: expiresIn || '24hrs' })

  return verifyToken
}

// Generate an auth token for customer
CustomerSchema.methods.generateAccessToken = async function () {
  const customer = this
  const accessToken = jwt.sign({
    _id: customer.merchant_id
  }, process.env.CLIENT_SECRET, { expiresIn: '1h' })

  return accessToken
}

// Get customers
CustomerSchema.statics.findCustomers = async ({ page, limit, store_hash }) => {
  const customers = await Customer
    .find({ store_hash })
    .skip((page - 1) * limit)
    .limit(limit)
    .select('-password')

  const total = await Customer.countDocuments({ store_hash })
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
CustomerSchema.statics.search = async ({ keyword, page, limit, store_hash }) => {
  const searchString = new RegExp(decodeURIComponent(keyword), 'i')
  const searchQuery = {
    fullname: { $concat: ['$first_name', ' ', '$last_name'] },
    first_name: 1,
    last_name: 1,
    email: 1
  }
  const searchArray = { $or: [{ fullname: searchString }, { email: searchString }], store_hash }
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
CustomerSchema.statics.findByEmail = async (email) => {
  const customer = await Customer
    .findOne({ email })
    .select('-password')

  return customer
}

// Find customer by verify token
CustomerSchema.statics.verifyToken = async (store_hash, verify_token) => {
  const customer = await Customer.updateOne({ store_hash, verify_token }, {
    verified: true,
    verify_token: null
  }).select('-password')
  return customer
}

// Find customer by email and password
CustomerSchema.statics.findByCredentials = async (email, password) => {
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
CustomerSchema.statics.getCount = async (store_hash) => {
  const total = await Customer.countDocuments({ store_hash })
  return {
    count: total
  }
}

// Update customer
CustomerSchema.statics.updateCustomer = async (customerId, customerDetails) => {
  let { password } = customerDetails
  const savedPassword = await Customer.findOne({ _id: customerId }).select('password')

  if (!password) {
    password = savedPassword.password
  } else {
    password = await bcrypt.hash(password, 8)
  }
  delete customerDetails.store_credit
  const customerResp = await customer.updateOne({ _id: customerId }, { ...customerDetails, password, updated_at: Date.now() })
  return customerResp
}

// Update customers store credit
CustomerSchema.statics.updateCustomersStoreCredit = async (customerId, storeCredit) => {
  const customer = await Customer.updateOne({
    _id: customerId
  }, {
    $inc: {
      store_credit: storeCredit
    },
    updated_at: Date.now()
  })

  return customer
}

// Delete customer by id
CustomerSchema.statics.deleteCustomer = async (customer_id) => {
  try {
    await CustomerAddress.deleteMany({ customer_id })
    await CustomerCoupon.deleteMany({ customer_id })
    const customer = await Customer.deleteOne({ _id: customer_id })
    return customer
  } catch (err) {
    throw new Error(err)
  }
}

const Customer = mongoose.model('Customer', CustomerSchema)

module.exports = Customer
