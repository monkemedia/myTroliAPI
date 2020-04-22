const mongoose = require('mongoose')
const storeSchema = require('./schema.js')

// Update store
storeSchema.statics.updateStore = async (storeDetails) => {
  const store = await Store.updateOne({}, storeDetails)
  return store
}

// Delete store
storeSchema.statics.deleteStore = async () => {
  const store = await Store.deleteOne()
  return store
}

const Store = mongoose.model('Store', storeSchema)

module.exports = Store
