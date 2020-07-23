const jwt = require('jsonwebtoken')
const Customer = require('../../models/customer')
const emailTemplate = require('../../utils/emailTemplate')

const createCustomer = async (req, res) => {
  try {
    // Check to see if customer already exists
    const data = req.body
    const { first_name, last_name, email, password, type } = data
    const customerExists = await Customer.findByCredentials(email)

    if (!first_name) {
      return res.status(401).send({
        message: 'First name is required'
      })
    }

    if (!last_name) {
      return res.status(401).send({
        message: 'Last name is required'
      })
    }

    if (!email) {
      return res.status(401).send({
        message: 'Email is required'
      })
    }

    if (!password) {
      return res.status(401).send({
        message: 'Password is required'
      })
    }

    if (!type) {
      return res.status(401).send({
        message: 'Type is required'
      })
    }

    if (type && type !== 'customer') {
      return res.status(401).send({
        message: 'Correct Type is required'
      })
    }

    if (customerExists) {
      return res.status(401).send({
        message: 'Customer already exists'
      })
    }

    const customer = new Customer(data)
    const token = await customer.generateVerifyToken('1hr')
    customer.verify_token = token
    await customer.save()
    await emailTemplate.verifyEmailAddress({
      name: `${first_name} ${last_name}`,
      email,
      token
    })

    res.status(201).send(customer)
  } catch (err) {
    res.status(400).send(err)
  }
}

const getCustomers = async (req, res) => {
  const query = req.query
  const page = parseInt(query.page) || 1
  const limit = parseInt(query.limit) || 20
  const keyword = query && query.keyword
  let customers

  try {
    if (keyword) {
      customers = await Customer.search({ page, limit, keyword })
    } else {
      customers = await Customer.findCustomers({ page, limit })
    }

    res.status(200).send(customers)
  } catch (err) {
    res.status(400).send(err)
  }
}

const getCustomer = async (req, res) => {
  const customerId = req.params.customerId
  let customer
  if (customerId === 'count') {
    customer = await Customer.getCount()
  } else {
    customer = await Customer.findOne({ _id: customerId }).select('-password')
  }

  res.status(200).send(customer)
}

const updateCustomer = async (req, res) => {
  const customerId = req.params.customerId
  const data = req.body
  const { type } = data

  if (!type) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (type && type !== 'customer') {
    return res.status(401).send({
      message: 'Correct Type is required'
    })
  }

  try {
    await Customer.updateCustomer(customerId, data)
    const customer = await Customer.findOne({ _id: customerId }).select('-password')

    res.status(200).send(customer)
  } catch (err) {
    res.status(400).send(err)
  }
}

const deleteCustomer = async (req, res) => {
  try {
    await Customer.deleteCustomer(req.params.customerId)

    res.status(204).send({
      message: 'Customer successfully deleted'
    })
  } catch (err) {
    res.status(400).send(err)
  }
}

const resendVerificationEmail = async (req, res) => {
  try {
    const data = req.body
    const { type, first_name, last_name, email } = data

    if (!type) {
      return res.status(401).send({
        message: 'Type is required'
      })
    }

    if (type !== 'customer') {
      return res.status(401).send({
        message: 'Correct Type is required'
      })
    }

    const customer = await Customer.findOne({ _id: req.params.customerId }).select('-password')
    const token = await customer.generateVerifyToken('1hr')

    customer.verify_token = token
    await customer.save()
    await emailTemplate.verifyEmailAddress({
      name: `${first_name} ${last_name}`,
      email,
      token
    })
    res.status(200).send({
      message: 'Verification email successfully sent'
    })
  } catch (err) {
    res.status(err.status).send(err)
  }
}

const verifyCustomer = async (req, res) => {
  try {
    const { type, verify_token } = req.body

    if (!type) {
      return res.status(401).send({
        message: 'Type is required'
      })
    }

    if (type !== 'verify_customer') {
      return res.status(401).send({
        message: 'Correct Type is required'
      })
    }

    try {
      jwt.verify(verify_token, process.env.VERIFY_SECRET)

      const customer = await Customer.verifyToken(verify_token)

      if (!customer) {
        // customer doesn't exist but we can't tell users that
        return res.status(401).send({
          message: 'Customer does not exist'
        })
      }

      res.status(200).send({
        message: 'Email address has been verified'
      })
    } catch (err) {
      if (err.message === 'jwt expired') {
        return res.status(401).send({
          message: 'Token has expired'
        })
      }
      return res.status(401).send({
        message: 'Token is incorrect'
      })
    }
  } catch (err) {
    res.status(err.status).send(err)
  }
}

module.exports = {
  createCustomer,
  getCustomers,
  getCustomer,
  updateCustomer,
  deleteCustomer,
  resendVerificationEmail,
  verifyCustomer
}
