const mongoose = require('mongoose')
const ShippingZoneSchema = require('./schema')

// Get zones
ShippingZoneSchema.statics.findZones = async (store_hash) => {
  const zones = await ShippingZone.find({ store_hash })
  return zones
}

// Get zone
ShippingZoneSchema.statics.findZone = async (zoneId) => {
  const zone = await ShippingZone.findOne({ _id: zoneId })
  return zone
}

// Get zone by country code
ShippingZoneSchema.statics.findZoneByCountryCode = async (country_code, store_hash) => {
  const zone = await ShippingZone.findOne({ country_code, store_hash })
  return zone
}

// Update zone
ShippingZoneSchema.statics.updateZone = async (zoneId, zoneDetails) => {
  const zone = await ShippingZone.updateOne({ _id: zoneId }, {
    ...zoneDetails,
    updated_at: Date.now()
  })
  return zone
}

// Delete zone
ShippingZoneSchema.statics.deleteZone = async (zoneId) => {
  const zone = await ShippingZone.deleteOne({ _id: zoneId })
  return zone
}

const ShippingZone = mongoose.model('ShippingZone', ShippingZoneSchema)

module.exports = ShippingZone
