const mongoose = require('mongoose')
const settingSchema = require('./schema')

// Get coupons
settingSchema.statics.findSettings = async () => {
  const settings = await Setting.findOne()
  return settings
}

// Update coupon
settingSchema.statics.updateSettings = async (data) => {
  delete data.type
  const setting = await Setting.findOneAndUpdate({ type: 'settings ' }, {
    ...data,
    updated_at: Date.now()
  }, {
    upsert: true
  })

  return setting
}

const Setting = mongoose.model('setting', settingSchema)

module.exports = Setting
