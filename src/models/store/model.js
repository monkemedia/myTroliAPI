const mongoose = require('mongoose')
const storeSchema = require('./schema.js')

// Update store
storeSchema.statics.updateStore = async (data) => {
  delete data.type
  const store = await Store.findOneAndUpdate({ type: 'store' }, data, { upsert: true })
  return store
}

const Store = mongoose.model('Store', storeSchema)

module.exports = Store
