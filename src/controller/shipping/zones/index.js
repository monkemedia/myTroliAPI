const ShippingZone = require('../../../models/shipping/zone')

const createShippingZone = async (req, res) => {
  const data = req.body

  if (!data.type) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (data.type !== 'shipping-zone') {
    return res.status(401).send({
      message: 'Correct type is required'
    })
  }

  if (!data.name) {
    return res.status(401).send({
      message: 'Name is required'
    })
  }

  if (!data.country_code) {
    return res.status(401).send({
      message: 'Country code is required'
    })
  }

  try {
    // Check to see if zone already exists
    const zoneExists = await ShippingZone.findZoneByCountryCode(data.country_code)
    if (zoneExists) {
      return res.status(401).send({
        message: 'Zone already exists'
      })
    }
    const shippingZone = new ShippingZone(data)
    const savedShippingZone = await shippingZone.save()

    res.status(201).send(savedShippingZone)
  } catch (err) {
    res.status(400).send(err)
  }
}

const getShippingZones = async (req, res) => {
  try {
    const shippingZones = await ShippingZone.findZones()

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

  if (!data.type) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (data.type !== 'shipping-zone') {
    return res.status(401).send({
      message: 'Correct type is required'
    })
  }

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
