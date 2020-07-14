const ShippingAddress = require('../../../models/shipping/address')

const createShippingAddress = async (req, res) => {
  const data = req.body

  // Lets see if shipping address already exists
  const shippingAddress = await ShippingAddress.findOne()

  if (shippingAddress) {
    return res.status(401).send({
      message: 'There is already a shipping address.'
    })
  }

  if (!data.type) {
    return res.status(401).send({
      message: 'Type is required.'
    })
  }

  if (data.type !== 'shipping-address') {
    return res.status(401).send({
      message: 'Correct Type is required.'
    })
  }

  try {
    const shippingAddress = new ShippingAddress(data)
    const savedShippingAddress = await shippingAddress.save()

    res.status(201).send(savedShippingAddress)
  } catch (err) {
    res.status(400).send(err)
  }
}

const getShippingAddress = async (req, res) => {
  try {
    const shippingAddress = await ShippingAddress.findOne()

    res.status(200).send(shippingAddress)
  } catch (err) {
    res.status(400).send(err)
  }
}

const updateShippingAddress = async (req, res) => {
  const data = req.body

  if (!data.type) {
    return res.status(401).send({
      message: 'Type is required.'
    })
  }

  if (data.type !== 'shipping-address') {
    return res.status(401).send({
      message: 'Correct Type is required.'
    })
  }

  try {
    await ShippingAddress.updateShippingAddress(data)
    const shippingAddress = await ShippingAddress.findOne()

    res.status(200).send(shippingAddress)
  } catch (err) {
    res.status(400).send(err)
  }
}

const deleteShippingAddress = async (req, res) => {
  try {
    await ShippingAddress.deleteShippingAddress()

    res.status(200).send({
      message: 'Shipping address successfully deleted.'
    })
  } catch (err) {
    res.status(400).send(err)
  }
}

module.exports = {
  createShippingAddress,
  getShippingAddress,
  deleteShippingAddress,
  updateShippingAddress
}
