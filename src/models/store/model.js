const StoreSchema = require('./schema.js')
const { tenantModel } = require('../../utils/multitenancy')

// Update store
StoreSchema.statics.updateStore = async (data) => {
  delete data.type
  const store = await Store().findOneAndUpdate({ type: 'store' }, {
    ...data,
    updated_at: Date.now()
  }, { upsert: true })
  return store
}

const Store = function () {
  return tenantModel('Store', StoreSchema)
}
module.exports = Store
