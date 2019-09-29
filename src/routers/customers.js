const express = require('express')
const Customer = require('../models/Customer')
const auth = require('../middleware/auth')
const router = express.Router()

// Get token
router.post('/customers/access_token', async (req, res) => {
  try {
    const { email, password, type } = req.body

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

    if (type && type !== 'token') {
      return res.status(401).send({
        message: 'Correct Type is required'
      })
    }

    const customer = await Customer.findByCredentials(email, password)
    const accessToken = await customer.generateAccessToken()

    res.send({
      grant_type: 'implicit',
      customer_id: customer._id,
      access_token: accessToken
    })
  } catch (err) {
    res.status(err.status).send(err)
  }
})

// Create a new customer
router.post('/customers', async (req, res) => {
  try {
    // Check to see if customer already exists
    const { name, email, password, type } = req.body
    const customerExists = await Customer.findByEmail(email)

    if (!name) {
      return res.status(401).send({
        message: 'Name is required'
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

    const customer = new Customer(req.body)

    await customer.save()

    const { _id } = customer

    res.status(201).send({
      type,
      _id,
      name,
      email,
      password: !!password
    })
  } catch (err) {
    res.status(400).send(err)
  }
})

// Get all customer
// router.get('/customers', auth, async (req, res) => {
//   try {
//     const customers = await Customer.getAll()

//     const newCustomers = customers.map(customer => Object.assign(customer, {
//       password: !!customer.password
//     }))

//     res.status(201).send(newCustomers)
//   } catch (err) {
//     res.status(400).send(err)
//   }

//   // res.status(201).send(customer)
// })

// Get customer
router.get('/customers/:customerId', auth, async (req, res) => {
  const customer = await Customer.findOne({ _id: req.params.customerId })
  const customerClone = Object.assign(customer, {
    password: !!customer.password
  })

  res.status(201).send(customerClone)
})

// Update customer
router.put('/customers/:customerId', auth, async (req, res) => {
  const _id = req.params.customerId
  const currentCustomerDetails = await Customer.findOne({ _id: req.params.customerId })
  const { type, name, email, password } = req.body

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

  const data = {
    type,
    _id,
    name: name || currentCustomerDetails.name,
    email: email || currentCustomerDetails.email,
    password: password || currentCustomerDetails.password
  }

  try {
    await Customer.updateCustomer(data)

    res.status(201).send(data)
  } catch (err) {
    res.status(400).send(err)
  }
})

// Delete customer
router.delete('/customers/:customerId', auth, async (req, res) => {
  try {
    await Customer.deleteCustomer(req.params.customerId)

    res.status(201).send({
      message: 'Customer successfully deleted'
    })
  } catch (err) {
    res.status(400).send(err)
  }
})

module.exports = router
