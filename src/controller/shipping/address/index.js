const ShippingAddress = require('../../../models/shipping/address')

const createShippingAddress = async (req, res) => {
  const data = req.body
  const store_hash = req.params.storeHash

  // Lets see if shipping address already exists
  const shippingAddress = await ShippingAddress.findOne({ store_hash })

  if (shippingAddress) {
    return res.status(401).send({
      message: 'There is already a shipping address'
    })
  }

  try {
    delete data.country // Converting ISO to country is handled on backend
    const shippingAddress = new ShippingAddress({
      ...data,
      store_hash
    })
    const savedShippingAddress = await shippingAddress.save()

    res.status(201).send(savedShippingAddress)
  } catch (err) {
    res.status(400).send(err)
  }
}

const getShippingAddress = async (req, res) => {
  try {
    const store_hash = req.params.storeHash
    const shippingAddress = await ShippingAddress.findOne({ store_hash })

    res.status(200).send(shippingAddress)
  } catch (err) {
    res.status(400).send(err)
  }
}

const updateShippingAddress = async (req, res) => {
  const data = req.body
  const store_hash = req.params.storeHash
  delete data.country // Converting ISO to country is handled on backend

  try {
    await ShippingAddress.updateShippingAddress(data, store_hash)
    const shippingAddress = await ShippingAddress.findOne({ store_hash })

    res.status(200).send(shippingAddress)
  } catch (err) {
    res.status(400).send(err)
  }
}

const deleteShippingAddress = async (req, res) => {
  try {
    const store_hash = req.params.storeHash
    await ShippingAddress.deleteShippingAddress(store_hash)

    res.status(200).send({
      message: 'Shipping address successfully deleted'
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
