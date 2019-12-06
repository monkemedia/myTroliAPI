const express = require('express')
const Address = require('../../models/address')
const auth = require('../../middleware/auth')
const router = express.Router()

// Create a new address
router.post('/customers/:customerId/addresses', auth, async (req, res) => {
  const data = req.body.data
  const { type, first_name, last_name, line_1, county, postcode, country } = data
  const customer_id = req.params.customerId

  if (!type) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (type && type !== 'address') {
    return res.status(401).send({
      message: 'Correct Type is required'
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

  if (!county) {
    return res.status(401).send({
      message: 'County is required'
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
    const addresses = new Address({ ...data, customer_id })

    await addresses.save()

    res.status(201).send({ data: addresses })
  } catch (err) {
    res.status(400).send(err)
  }
})

// Get all addresses
router.get('/customers/:customerId/addresses', auth, async (req, res) => {
  try {
    const customer_id = req.params.customerId
    const addresses = await Address.findAllAddresses(customer_id)

    res.status(200).send({ data: addresses })
  } catch (err) {
    res.status(400).send(err)
  }
})

// Get an address
router.get('/customers/:customerId/addresses/:addressId', auth, async (req, res) => {
  try {
    const address_id = req.params.addressId
    const addresses = await Address.findAddress(address_id)

    res.status(200).send({ data: addresses })
  } catch (err) {
    res.status(400).send(err)
  }
})

// Update can address
router.put('/customers/:customerId/addresses/:addressId', auth, async (req, res) => {
  const _id = req.params.addressId
  const data = req.body.data
  const { type, first_name, last_name, company_name, line_1, line_2, city, county, postcode, country, phone_number, instructions } = data

  if (!type) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (type && type !== 'address') {
    return res.status(401).send({
      message: 'Correct Type is required'
    })
  }

  try {
    const address_id = req.params.addressId
    const currentAddress = await Address.findAddress(address_id)

    const data = {
      type,
      _id,
      first_name: first_name || currentAddress.first_name,
      last_name: last_name || currentAddress.last_name,
      company_name: company_name || currentAddress.company_name,
      line_1: line_1 || currentAddress.line_1,
      line_2: line_2 || currentAddress.line_2,
      city: city || currentAddress.city,
      county: county || currentAddress.county,
      postcode: postcode || currentAddress.postcode,
      country: country || currentAddress.country,
      phone_number: phone_number || currentAddress.phone_number,
      instructions: instructions || currentAddress.instructions,
      default: req.body.default || currentAddress.default
    }

    await Address.updateAddress(data)

    res.status(200).send({ data })
  } catch (err) {
    res.status(400).send(err)
  }
})

// Delete an address
router.delete('/customers/:customerId/addresses/:addressId', auth, async (req, res) => {
  try {
    const address_id = req.params.addressId
    await Address.deleteAddress(address_id)

    res.status(200).send({
      message: 'Address successfully deleted'
    })
  } catch (err) {
    res.status(400).send(err)
  }
})

module.exports = router
