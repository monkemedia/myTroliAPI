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

// Search products by Name or SKU
customerSchema.statics.search = async ({ query }) => {
  console.log('query', query)
  const regex = new RegExp(query, 'i')
  const customers = await Customer
    .aggregate([
      {
        $project: {
          name: {
            $concat: ['$first_name', ' ', '$last_name']
          },
          email: 1
        }
      },
      {
        $match: {
          name: {
            $regex: regex
          }
        }
      }
    ]) // .select('-password')

  return customers
}

// Find customer by email address
customerSchema.statics.findByEmail = async (email) => {
  const customer = await Customer.findOne({ email }).select('-password')

  return customer
}

// Find customer by email and password
customerSchema.statics.findByCredentials = async (email, password) => {
  const customer = await Customer.findOne({ email }).select('-password')

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
