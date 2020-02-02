const mongoose = require('mongoose')
const uniqueArrayPlugin = require('mongoose-unique-array')
const productVariantOptionSchema = require('./schema')

productVariantOptionSchema.plugin(uniqueArrayPlugin)

// Find all category relationships by category id
// productVariantOptionSchema.statics.findAllByCategoryIds = async (id) => {
//   const category = await Category.find({ 'data.category_id': id })
//   return category
// }

// Get all Options
productVariantOptionSchema.statics.findAllOptions = () => Option.find({})

// Find option by id
productVariantOptionSchema.statics.findOption = (optionId) => Option.findOne({ _id: optionId })

// Delete option
productVariantOptionSchema.statics.deleteOption = (optionId) => Option.deleteOne({ _id: optionId })

// Update option
productVariantOptionSchema.statics.updateOption = async (optionDetails) => {
  const { _id } = optionDetails
  await Option.updateOne({ _id }, optionDetails)
}

const Option = mongoose.model('ProductVariantOption', productVariantOptionSchema)

module.exports = Option
