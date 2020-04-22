const mongoose = require('mongoose')
const storeSchema = require('./schema.js')

// Update store
storeSchema.statics.updateStore = async (_id, storeDetails) => {
  const store = await Store.updateOne({ _id }, storeDetails)
  return store
}

// Delete store
storeSchema.statics.deleteStore = async (_id) => {
  const store = await Store.deleteOne({ _id })
  return store
}

const Store = mongoose.model('Store', storeSchema)

module.exports = Store
