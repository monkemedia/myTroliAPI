const Customer = require('../models/customer')

const createCustomer = async (req, res) => {
  try {
    // Check to see if customer already exists
    const data = req.body
    const { name, email, password, type } = data
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

    const customer = new Customer(data)

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
}

const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.findCustomers()

    const newCustomers = customers.map(customer => Object.assign(customer, {
      password: !!customer.password
    }))

    res.status(200).send([...newCustomers])
  } catch (err) {
    res.status(400).send(err)
  }
}

const getCustomer = async (req, res) => {
  const customer = await Customer.findOne({ _id: req.params.customerId })
  const customerClone = Object.assign(customer, {
    password: !!customer.password
  })

  res.status(200).send(customerClone)
}

const updateCustomer = async (req, res) => {
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

    res.status(200).send(data)
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

module.exports = {
  createCustomer,
  getCustomers,
  getCustomer,
  updateCustomer,
  deleteCustomer
}
