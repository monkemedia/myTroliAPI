const ShippingMethod = require('../../../../models/shipping/zone/methods')

const conditions = [
  'shipping-method'
]

const createShippingMethod = async (req, res) => {
  let data = req.body
  const zoneId = req.params.zoneId
  const store_hash = req.params.storeHash

  data = {
    ...data,
    shipping_zone_id: zoneId
  }

  if (!data.name) {
    return res.status(401).send({
      message: 'Name is required'
    })
  }

  if (!data.shipping_zone_id) {
    return res.status(401).send({
      message: 'Shipping zone ID is required'
    })
  }

  try {
    const shippingMethod = new ShippingMethod({
      ...data,
      store_hash
    })
    const savedShippingMethod = await shippingMethod.save()

    res.status(201).send(savedShippingMethod)
  } catch (err) {
    res.status(400).send(err)
  }
}

const getShippingMethods = async (req, res) => {
  try {
    const store_hash = req.params.storeHash
    const shippingMethods = await ShippingMethod.findMethods(store_hash)
    res.status(200).send(shippingMethods)
  } catch (err) {
    res.status(400).send(err)
  }
}

const getShippingMethod = async (req, res) => {
  const methodId = req.params.methodId
  try {
    const shippingMethod = await ShippingMethod.findMethod(methodId)

    res.status(200).send(shippingMethod)
  } catch (err) {
    res.status(400).send(err)
  }
}

const updateShippingMethod = async (req, res) => {
  const data = req.body
  const methodId = req.params.methodId

  try {
    await ShippingMethod.updateMethod(methodId, data)
    const shippingMethod = await ShippingMethod.findMethod(methodId)

    res.status(200).send(shippingMethod)
  } catch (err) {
    res.status(400).send(err)
  }
}

const deleteShippingMethod = async (req, res) => {
  const methodId = req.params.methodId
  try {
    await ShippingMethod.deleteMethod(methodId)

    res.status(200).send({
      message: 'Shipping method successfully deleted'
    })
  } catch (err) {
    res.status(400).send(err)
  }
}

module.exports = {
  createShippingMethod,
  getShippingMethods,
  getShippingMethod,
  deleteShippingMethod,
  updateShippingMethod
}
