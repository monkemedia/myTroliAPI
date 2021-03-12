const mongoose = require('mongoose')
const SettingSchema = require('./schema')

// Get settings
SettingSchema.statics.findSettings = async (store_hash) => {
  const settings = await Setting.findOne({ store_hash })
  return settings
}

// Update setting
SettingSchema.statics.updateSettings = async (data, store_hash) => {
  const setting = await Setting.findOneAndUpdate({ store_hash }, {
    ...data,
    updated_at: Date.now()
  }, {
    upsert: true
  })

  return setting
}

const Setting = mongoose.model('Setting', SettingSchema)

module.exports = Setting
