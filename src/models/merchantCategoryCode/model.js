const mongoose = require('mongoose')
const MerchantCategoryCodeSchema = require('./schema')


// Get merchant category codes
MerchantCategoryCodeSchema.statics.findMerchantCategoryCodes = async () => {
  const merchantCategoryCodes = await MerchantCategoryCode.find({})
  return merchantCategoryCodes
}

const MerchantCategoryCode = mongoose.model('MerchantCategoryCode', MerchantCategoryCodeSchema)

module.exports = MerchantCategoryCode
