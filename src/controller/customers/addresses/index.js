const CustomerAddress = require('../../../models/customer/address')

const createCustomerAddress = async (req, res) => {
  const data = req.body
  const {
    first_name,
    last_name,
    line_1,
    city,
    postcode,
    country_code
  } = data
  const customer_id = req.params.customerId
  const store_hash = req.params.storeHash

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

  if (!country_code) {
    return res.status(401).send({
      message: 'Country code is required'
    })
  }

  try {
    const customerAddresses = new CustomerAddress({ ...data, customer_id, store_hash })

    await customerAddresses.save()

    res.status(201).send(customerAddresses)
  } catch (err) {
    res.status(400).send(err)
  }
}

const getCustomerAddresses = async (req, res) => {
  try {
    const customerId = req.params.customerId
    const customerAddresses = await CustomerAddress.findCustomerAddresses(customerId)

    res.status(200).send(customerAddresses)
  } catch (err) {
    res.status(400).send(err)
  }
}

const getCustomerAddress = async (req, res) => {
  try {
    const addressId = req.params.addressId
    const customerAddress = await CustomerAddress.findCustomerAddress(addressId)

    res.status(200).send(customerAddress)
  } catch (err) {
    res.status(400).send(err)
  }
}

const updateCustomerAddress = async (req, res) => {
  const addressId = req.params.addressId
  const data = req.body

  try {
    await CustomerAddress.updateCustomerAddress(addressId, data)
    const customerAddress = await CustomerAddress.findCustomerAddress(addressId)

    res.status(200).send(customerAddress)
  } catch (err) {
    res.status(400).send(err)
  }
}

const deleteCustomerAddress = async (req, res) => {
  try {
    const addressId = req.params.addressId
    await CustomerAddress.deleteCustomerAddress(addressId)

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
