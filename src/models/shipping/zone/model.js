const ShippingZoneSchema = require('./schema')
const { tenantModel } = require('../../../utils/multitenancy');

// Get zones
ShippingZoneSchema.statics.findZones = async () => {
  const zones = await ShippingZone().find({})
  return zones
}

// Get zone
ShippingZoneSchema.statics.findZone = async (zoneId) => {
  const zone = await ShippingZone().findOne({ _id: zoneId })
  return zone
}

// Get zone by country code
ShippingZoneSchema.statics.findZoneByCountryCode = async (countryCode) => {
  const zone = await ShippingZone().findOne({ country_code: countryCode })
  return zone
}

// Update zone
ShippingZoneSchema.statics.updateZone = async (zoneId, zoneDetails) => {
  const zone = await ShippingZone().updateOne({ _id: zoneId }, {
    ...zoneDetails,
    updated_at: Date.now()
  })
  return zone
}

// Delete zone
ShippingZoneSchema.statics.deleteZone = async (zoneId) => {
  const zone = await ShippingZone().deleteOne({ _id: zoneId })
  return zone
}

const ShippingZone = function () {
  return tenantModel('ShippingZone', ShippingZoneSchema)
}
module.exports = ShippingZone
