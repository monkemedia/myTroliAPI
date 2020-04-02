const CustomerAddress = require('../../../models/customer/address')

const createCustomerAddress = async (req, res) => {
  const data = req.body
  const {
    type,
    first_name,
    last_name,
    phone_number,
    line_1,
    city,
    postcode,
    country
  } = data
  const customer_id = req.params.customerId

  if (!type) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (type && type !== 'customer-address') {
    return res.status(401).send({
      message: 'Correct Type is required'
    })
  }

  if (!phone_number) {
    return res.status(401).send({
      message: 'Phone number is required'
    })
  }

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

  if (!line_1) {
    return res.status(401).send({
      message: 'Line 1 is required'
    })
  }

  if (!city) {
    return res.status(401).send({
      message: 'City is required'
    })
  }

  if (!postcode) {
    return res.status(401).send({
      message: 'Postcode is required'
    })
  }

  if (!country) {
    return res.status(401).send({
      message: 'Country is required'
    })
  }

  try {
    const customerAddresses = new CustomerAddress({ ...data, customer_id })

    await customerAddresses.save()

    res.status(201).send(customerAddresses)
  } catch (err) {
    res.status(400).send(err)
  }
}

const getCustomerAddresses = async (req, res) => {
  try {
    const customer_id = req.params.customerId
    const customerAddresses = await CustomerAddress.findCustomerAddresses(customer_id)

    res.status(200).send(customerAddresses)
  } catch (err) {
    res.status(400).send(err)
  }
}

const getCustomerAddress = async (req, res) => {
  try {
    const address_id = req.params.addressId
    const customerAddresses = await CustomerAddress.findCustomerAddress(address_id)

    res.status(200).send(customerAddresses)
  } catch (err) {
    res.status(400).send(err)
  }
}

const updateCustomerAddress = async (req, res) => {
  const data = req.body
  const addressId = req.params.addressId
  const { type } = data

  if (!type) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (type && type !== 'customer-address') {
    return res.status(401).send({
      message: 'Correct Type is required'
    })
  }

  try {
    await CustomerAddress.updateCustomerAddress(addressId, data)

    res.status(200).send(data)
  } catch (err) {
    res.status(400).send(err)
  }
}

const deleteCustomerAddress = async (req, res) => {
  try {
    const address_id = req.params.addressId
    await CustomerAddress.deleteCustomerAddress(address_id)

    res.status(200).send({
      message: 'Customer Address successfully deleted'
    })
  } catch (err) {
    res.status(400).send(err)
  }
}

module.exports = {
  createCustomerAddress,
  getCustomerAddresses,
  getCustomerAddress,
  updateCustomerAddress,
  deleteCustomerAddress
}
