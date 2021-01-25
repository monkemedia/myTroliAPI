const mongoose = require('mongoose')
const StoreSchema = require('./schema.js')

// Update store
StoreSchema.statics.updateStore = async (data) => {
  delete data.type
  const store = await Store.findOneAndUpdate({ type: 'store' }, {
    ...data,
    updated_at: Date.now()
  }, { upsert: true })
  return store
}

const Store = mongoose.model('Store', StoreSchema)

module.exports = Store
