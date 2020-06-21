const mongoose = require('mongoose')
const shippingZoneSchema = require('./schema')

// Get zones
shippingZoneSchema.statics.findZones = async () => {
  const zones = await ShippingZone.find({})
  return zones
}

// Get zone
shippingZoneSchema.statics.findZone = async (zoneId) => {
  const zone = await ShippingZone.findOne({ _id: zoneId })
  return zone
}

// Get zone by country code
shippingZoneSchema.statics.findZoneByCountryCode = async (countryCode) => {
  const zone = await ShippingZone.findOne({ country_code: countryCode })
  return zone
}

// Update zone
shippingZoneSchema.statics.updateZone = async (zoneId, zoneDetails) => {
  const zone = await ShippingZone.updateOne({ _id: zoneId }, zoneDetails)
  return zone
}

// Delete zone
shippingZoneSchema.statics.deleteZone = async (zoneId) => {
  const zone = await ShippingZone.deleteOne({ _id: zoneId })
  return zone
}

const ShippingZone = mongoose.model('ShippingZone', shippingZoneSchema)

module.exports = ShippingZone
