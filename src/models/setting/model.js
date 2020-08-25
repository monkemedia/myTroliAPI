const SettingSchema = require('./schema')
const { tenantModel } = require('../../utils/multitenancy');

// Get settings
SettingSchema.statics.findSettings = async () => {
  const settings = await Setting().findOne()
  return settings
}

// Update setting
SettingSchema.statics.updateSettings = async (data) => {
  delete data.type
  const setting = await Setting().findOneAndUpdate({ type: 'settings ' }, {
    ...data,
    updated_at: Date.now()
  }, {
    upsert: true
  })

  return setting
}

const Setting = function () {
  return tenantModel('Setting', SettingSchema)
}
module.exports = Setting
