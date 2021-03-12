const mongoose = require('mongoose')
const StoreSchema = require('./schema.js')
const { convertISOToCountry} = require('../../utils/helpers')

StoreSchema.pre('save', async function (next) {
  const store = this
  store.country = await convertISOToCountry(store.country_code)
  next()
})

// Update store
StoreSchema.statics.updateStore = async (data, store_hash) => {
  const country = await convertISOToCountry(data.country_code)
  const store = await Store.findOneAndUpdate({ store_hash }, {
    ...data,
    country,
    updated_at: Date.now()
  }, { upsert: true })
  return store
}

const Store = mongoose.model('Store', StoreSchema)

module.exports = Store
