const ShippingZone = require('../../../models/shipping/zone')

const createShippingZone = async (req, res) => {
  const data = req.body
  const store_hash = req.params.storeHash

  if (!data.country_code) {
    return res.status(401).send({
      message: 'Country code is required'
    })
  }

  try {
    // Check to see if zone already exists
    const zoneExists = await ShippingZone.findZoneByCountryCode(data.country_code, store_hash)
    if (zoneExists) {
      return res.status(401).send({
        message: 'Zone already exists'
      })
    }
    delete data.country // Converting ISO to country is handled on backend
    const shippingZone = new ShippingZone({
      ...data,
      store_hash
    })
    const savedShippingZone = await shippingZone.save()

    res.status(201).send(savedShippingZone)
  } catch (err) {
    res.status(400).send(err)
  }
}

const getShippingZones = async (req, res) => {
  try {
    const store_hash = req.params.storeHash
    const shippingZones = await ShippingZone.findZones(store_hash)

    res.status(200).send(shippingZones)
  } catch (err) {
    res.status(400).send(err)
  }
}

const getShippingZone = async (req, res) => {
  const zoneId = req.params.zoneId
  try {
    const shippingZone = await ShippingZone.findZone(zoneId)

    res.status(200).send(shippingZone)
  } catch (err) {
    res.status(400).send(err)
  }
}

const updateShippingZone = async (req, res) => {
  const data = req.body
  const zoneId = req.params.zoneId
  delete data.country // Converting ISO to country is handled on backend

  try {
    await ShippingZone.updateZone(zoneId, data)
    const shippingZone = await ShippingZone.findZone(zoneId)

    res.status(200).send(shippingZone)
  } catch (err) {
    res.status(400).send(err)
  }
}

const deleteShippingZone = async (req, res) => {
  const zoneId = req.params.zoneId
  try {
    await ShippingZone.deleteZone(zoneId)

    res.status(200).send({
      message: 'Shipping zone successfully deleted'
    })
  } catch (err) {
    res.status(400).send(err)
  }
}

module.exports = {
  createShippingZone,
  getShippingZones,
  getShippingZone,
  deleteShippingZone,
  updateShippingZone
}
